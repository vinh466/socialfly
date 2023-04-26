import Button from '@/components/Button'
import { SocketContext, SocketContextValue } from '@/components/SocketContext'
import { useGetRoomListQuery } from '@/services/chat.service'
import { RootState } from '@/store'
import { chatAction } from '@/store/chat.slice'
import { Room, RoomUser } from '@/types/chat.type'
import { RoomInfo, getRoomInfo } from '@/utils/chat.util'
import classNames from 'classnames'
import { memo, useContext, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface PropType {
}

function ConversationList({ }: PropType) {
    const { socket } = useContext(SocketContext) as SocketContextValue
    const { roomId } = useParams()
    const navigate = useNavigate();
    const { chat: { chatRoomList } } = useSelector((state: RootState) => state);

    const handleChangeRoom = (roomId: string) => {
        navigate('/chat/' + roomId)
    }
    useEffect(() => {
        if (!roomId && chatRoomList.length) handleChangeRoom(chatRoomList[0].id)
    }, [chatRoomList])
    return (
        <div className='flex flex-col min-w-[200px]'>
            <div className="flex-1">
                <ul className='text-center'>
                    {chatRoomList.length ? chatRoomList.map((room, i) => (

                        <li key={room.id}>
                            <Button
                                className={classNames(
                                    'w-full py-3 pl-4 flex gap-3 items-center', {

                                })}
                                active={roomId === room.id}
                                onClick={() => handleChangeRoom(room.id)}
                            >
                                <img src={room.roomAvatar} className="rounded-4xl object-cover w-8 h-8" alt="avatar" width={40} height={40} />
                                <div className='flex flex-col text-sm'>
                                    <span>{room.roomName}</span>
                                    <span className='font-light dark:text-gray-300'>{room.newestMessage?.messageBody || ''}</span>
                                </div>
                            </Button>
                        </li>
                    ))
                        :
                        <>
                            <li className="h-10 p-4">Không có nhóm nào</li>
                            <li className="h-10 p-4"><Link to={'/friend'}>
                                <Button className='px-3 py-1' border>Tìm</Button>
                            </Link></li>
                        </>
                    }
                </ul>
            </div>
        </div>
    )
}

export default (ConversationList)