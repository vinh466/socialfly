interface UserCard {
    username: string,
    firstname: string,
    lastname: string,
    avatar: string,
    birth: string,
    email: string,
}
interface UserCardResult extends ApiResult<UserCard[]> { }

interface FriendCardResult extends ApiResult<Array<UserCard & { chatRoomId: string }>> { }

interface FriendRequestResult extends ApiResult<null, ApiPostMeta> { }