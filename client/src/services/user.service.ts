import { AxiosClient } from "@/utils/http";
const controller = new AbortController();

class UserService extends AxiosClient {

    constructor() {
        super('/api/user');
    }

    async getAll(controller?: AbortController) {

        return (await this.privateApi.get<UserCardResult>("/",
            { signal: controller?.signal }
        )).data;
    }

    async getRecommend(controller?: AbortController) {
        return (await this.privateApi.get<UserCardResult>("/getRecommend",
            { signal: controller?.signal }
        )).data;
    }

    async getFriends(controller?: AbortController) {
        return (await this.privateApi.get<UserCardResult>("/getFriends",
            { signal: controller?.signal }
        )).data;
    }

    async getFriendRequest(controller?: AbortController) {
        return (await this.privateApi.get<UserCardResult>("/getFriendRequest",
            { signal: controller?.signal }
        )).data;
    }

    async sendFriendRequest(recipient: string, controller?: AbortController) {
        return (await this.privateApi.post<FriendRequestResult>("/sendFriendRequest",
            { username: recipient },
            { signal: controller?.signal }
        )).data;
    }

    async acceptFriendRequest(isAccept: boolean, recipient: string, controller?: AbortController) {
        return (await this.privateApi.post<FriendRequestResult>("/acceptFriendRequest",
            { isAccept, username: recipient },
            { signal: controller?.signal }
        )).data;
    }
    async create(data: any,) {
        return (await this.privateApi.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.privateApi.delete("/")).data;
    }
    async get(id: any,) {
        return (await this.privateApi.get(`/${id}`)).data;
    }
    async update(id: any, data: any,) {
        return (await this.privateApi.put(`/${id}`, data)).data;
    }
    async delete(id: any,) {
        return (await this.privateApi.delete(`/${id}`)).data;
    }
}


const userService = new UserService()
export default userService 