
import { verify as verifyJwt, sign as signJwt, JsonWebTokenError, JwtPayload } from "jsonwebtoken";

const publicKey = 'refreshTokenPublicKey'
const secretKey = 'accessTokenPrivateKey'

export const signRefreshToken = (username: string) => {
    const refreshToken = signJwt({ username }, publicKey, {
        expiresIn: '1d',
    });
    return refreshToken
}
export const verifyRefreshToken = (token: string) => {
    const decoded = verifyJwt(
        token, publicKey
    ) as JwtPayload;
    return (decoded)
}

export const verifyAccessToken = <T>(token: string): T => {
    const decoded = verifyJwt(
        token, secretKey
    ) as T;
    return (decoded)
}
export const signAccessToken = (username: string) => {
    const accessToken = signJwt({ username }, secretKey, {
        expiresIn: '1h',
    });
    return accessToken
}