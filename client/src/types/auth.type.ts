interface User {
    username: string
    password: string
    email?: string
    avatar?: string
    firstname?: string
    lastname?: string
    birth?: Date
    role: "USER",
    createat: Date
    updateAt?: Date
}

type Token = {
    accessToken: string
    refreshToken: string
}

interface UserLocal extends Partial<Omit<User, 'password'>>, Token { }

interface UserRefreshTokenRes extends Pick<User, 'username' | 'lastname' | 'avatar' | 'firstname'>, Token { }

interface UserRegisterRes extends Omit<User, 'password'>, Token { }

interface UserLoginRes extends Pick<User, 'username' | 'lastname' | 'avatar' | 'firstname'>, Token { }