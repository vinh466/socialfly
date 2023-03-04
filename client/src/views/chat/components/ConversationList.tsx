import Button from '@/components/Button'
import { SocketContext } from '@/components/SocketContext'
import { ChatEvent } from '@/declarations/socketEvent'
import { memo, useContext, useState, useCallback, useEffect } from 'react'

interface PropType {
    onChangeRoom: (roomId: string) => void
}

type Room = Record<string, { name: string }>
function ConversationList(props: PropType) {
    const { socket } = useContext(SocketContext)
    const [newRoomInput, setNewRoomInput] = useState('')
    const [roomActive, setRoomActive] = useState('')

    const [roomList, setRoomList] = useState<Room>({});

    useEffect(() => {
        console.info('[Listen]', ChatEvent.Server.Rooms);
        socket.on(ChatEvent.Server.Rooms, (payload: Room) => {
            setRoomList(payload)
        })
        socket.emit(ChatEvent.Client.GetRoom)
        return () => {
            socket.removeListener(ChatEvent.Server.Rooms)
            console.info('[Unlisten]', ChatEvent.Server.Rooms);
        }
    }, [])

    useEffect(() => { console.log(roomList); }, [roomList])
    const createRoom = (roomName: string) => {
        socket.emit(ChatEvent.Client.CreateRoom, ({ roomName: roomName }))
    }
    const handleChangeRoom = (roomId: string) => {
        props.onChangeRoom(roomId)
        setRoomActive(roomId)
    }

    return (
        <div className='flex flex-col'>
            <div className="header flex justify-around m-2">
                <input type="text"
                    className='border rounded-md'
                    value={newRoomInput}
                    onChange={(e) => { setNewRoomInput(e.target.value) }}
                />
                <span className=''>
                    <Button className='py-1 px-3'
                        onClick={() => createRoom(newRoomInput)}
                    >Tạo</Button>
                </span>
            </div>
            <div className="flex-1">
                <ul className='text-center'>
                    {roomList && Object.keys(roomList).length ?
                        Object.entries(roomList).map(([k, v], i) => {
                            return (
                                <li key={k}>
                                    <Button
                                        className={`w-full py-6 pl-2 h-5 ${roomActive === k && 'bg-gray-500 dark:hover:bg-gray-500'}`}
                                        onClick={() => handleChangeRoom(k)}
                                    >
                                        {v.name}
                                    </Button>
                                </li>
                            )
                        })
                        :
                        <li className="h-10">Không có nhóm nào</li>
                    }
                </ul>
            </div>
        </div>
    )
}

export default (ConversationList)