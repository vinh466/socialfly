import { localStorageService } from "@/services/localStorage.service";
import { RootState, useAppDispatch } from "@/store";
import { authAction } from "@/store/auth.slice";
import type { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useSelector } from "react-redux";

let subscribers: ((token: string) => void)[] = [];
const ignoreUrl = ['/', '/signin', '/refreshToken']

export class AxiosClient {
    protected api: AxiosInstance
    protected privateApi: AxiosInstance
    private isRefreshToken: boolean
    private subscribers: ((token: string) => void)[];

    constructor(baseURL: string = '/api') {
        this.api = this.createPublicApi(baseURL)
        this.privateApi = this.createPrivateApi(baseURL)
        this.isRefreshToken = false
        this.subscribers = []
    }

    private createPublicApi(baseURL: string) {
        return axios.create({ baseURL, timeout: 10000, headers: {}, })
    }
    private createPrivateApi(baseURL: string) {
        const instance = axios.create({ baseURL, timeout: 10000, headers: {}, })
        const $this = this;

        instance.interceptors.request.use((config) => {
            const accessToken = localStorageService.getLocalAccessToken()
            config.headers.authorization = accessToken
            return config
        }, (error) => Promise.reject(error))


        instance.interceptors.response.use((response) => response, async function (error) {
            const config = error?.config;
            if (error?.response?.status === 403) {

                if (!$this.isRefreshToken) {
                    return new Promise(resolve => {
                        $this.subscribeTokenRefresh(token => {
                            if (token && config.headers) {
                                config.headers = { //fix -> type RawAxiosHeaders = Record<string, AxiosHeaderValue | AxiosHeaders>;
                                    ...config.headers,
                                    authorization: `Bearer ${token}`
                                }
                            }
                            resolve(axios(config));
                        });
                    });
                }
                $this.isRefreshToken = true;
                const refreshToken = localStorageService.getLocalRefreshToken();
                const { data } = await axios.post<UserRefreshTokenRes>('/auth/refreshToken', {}, {
                    headers: {
                        'x-header-token': refreshToken,
                    },
                })

                if (data.accessToken) {
                    localStorageService.updateAccessToken(data.accessToken)
                    config.headers = {
                        ...config.headers,
                        authorization: data.accessToken,
                    };
                }
                return axios(config);
            }
            return Promise.reject(error);
        });
        return instance
    }
    getInstane() {
        return this.api
    }
    private subscribeTokenRefresh(cb: ((token: string) => void)) {
        subscribers.push(cb);
    }
    private onRefreshed(authorisationToken: string) {
        subscribers.map(cb => {
            console.log('is retry ???');
            cb(authorisationToken)
        });
        subscribers = [];
    }
}

const http = new AxiosClient().getInstane()
export default http