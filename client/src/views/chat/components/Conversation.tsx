import { useState, useContext, useEffect, memo } from 'react'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { chatAction } from '../../../store/chat.slice';
import { SocketContext } from '@/components/SocketContext';
import { ChatEvent } from '@/declarations/socketEvent';
import Button from '@/components/Button';

interface Message {
    message: string,
    username: string
    time?: string,
}
type ChatLog = Message[]

interface PropType {
    roomId: string
}
function Conversation(props: PropType) {
    const [messageInput, setMmessageInput] = useState('')
    const [chatLog, setChatLog] = useState<ChatLog>([])
    const { socket } = useContext(SocketContext)
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        console.log("Join room", props.roomId);
        socket.emit(ChatEvent.Client.GetRoom)
        socket.emit(ChatEvent.Client.JoinRoom, { roomId: props.roomId })
        setChatLog([])
        socket.on(ChatEvent.Server.RoomMessage, (payload: Message) => {
            setChatLog(state => [...state, payload])
        })

        return () => {
            console.log("Leave room", props.roomId);
            socket.emit(ChatEvent.Client.LeaveRoom, ({ roomId: props.roomId }))
            socket.removeListener(ChatEvent.Server.RoomMessage)
        }
    }, [props.roomId])
    useEffect(() => { console.log(chatLog); }, [chatLog])

    const dispatch = useDispatch();

    function sendMessage() {
        const msg = {
            roomId: props.roomId,
            message: messageInput,
            username: userInfo?.username || ''
        }
        socket.emit(ChatEvent.Client.SendRoomMessage, msg)

        setChatLog(state => [...state, msg])
    }
    return (
        <div className='h-full flex flex-col p-4'>
            {/* <div className="flex-1"></div>
            <div className=""><ChatInput /></div> */}
            <p>{props.roomId}</p>
            <div className="room ">
                <div className="control flex">
                    <input type="text" placeholder='message'
                        value={messageInput}
                        onChange={(e) => setMmessageInput(e.target.value)}
                        className='bg-slate-800 p-2 rounded-md mr-3'
                        onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    />
                    <Button className='block w-[110px] px-2' onClick={sendMessage}>Gửi</Button>
                </div>
                <div className="history">
                    {
                        chatLog.map((e: Message, i) => {
                            return (
                                <li key={i}>{e.username}: {e.message}</li>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(Conversation)