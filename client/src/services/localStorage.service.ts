const getLocalRefreshToken = () => {
    const localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    return localUser?.refreshToken;
};

const getLocalAccessToken = (): string | undefined => {
    const localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    return localUser?.accessToken;
};

const updateRefreshToken = (token: string) => {
    const localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    const user = {
        ...localUser,
        refreshToken: token
    };
    localStorage.setItem("user", JSON.stringify(user));
};
const updateAccessToken = (token: string) => {
    let localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    const user = {
        ...localUser,
        accessToken: token
    };
    localStorage.setItem("user", JSON.stringify(user));
};

const isLogin = () => {
    const localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    return !!(localUser?.refreshToken);
};
const getUser = () => {
    return JSON.parse(localStorage.getItem("user") as string) as UserLocal | null;
};

const setUser = (user: Partial<UserLocal>) => {
    let localUser: UserLocal | null = JSON.parse(localStorage.getItem("user") as string);
    const newUser = {
        ...localUser,
        ...user
    };
    localStorage.setItem("user", JSON.stringify(newUser));
};

const removeUser = () => {
    localStorage.removeItem("user");
};

const localStorageService = {
    getLocalRefreshToken,
    getLocalAccessToken, isLogin,
    updateRefreshToken,
    updateAccessToken,
    getUser,
    setUser,
    removeUser,
};

export { localStorageService };