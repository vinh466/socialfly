interface UserCard {
    username: string,
    firstname: string,
    lastname: string,
    avatar: string,
    birth: string,
    email: string,
}
interface UserCardResult extends ApiResult<UserCard[]> { }

interface FriendRequestResult extends ApiResult<null, ApiPostMeta> { }