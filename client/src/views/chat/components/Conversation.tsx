import { useState, useContext, useEffect, memo, useCallback, useMemo } from 'react'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';
import { chatAction } from '../../../store/chat.slice';
import { SocketContext, SocketContextValue } from '@/components/SocketContext';
import { ChatEvent } from '@/declarations/socketEvent';
import Button from '@/components/Button';
import { Link, useParams } from 'react-router-dom';
import { ChatLog, Message, MessageReq, Room } from '@/types/chat.type';
import ChatMessage from './ChatMessage';
import { useGetChatLogQuery } from '@/services/chat.service';
import { ServerEmit } from '@/types/socket.type';
import { RoomInfo, formatChatLog, getRoomInfo } from '@/utils/chat.util';
import { BsCameraVideoFill, BsFillChatQuoteFill, BsTelephoneFill, BsThreeDotsVertical } from 'react-icons/bs';
import Portal from '@/components/Portal';
import CallChat from '@/components/CallChat';
import VideoCallChat from '@/components/VideoCallChat';
import Peer from 'peerjs';


interface PropTypes {
    roomId: string
}

function Conversation(props: PropTypes) {
    const { socket } = useContext(SocketContext) as SocketContextValue
    const {
        auth: { userInfo },
        chat: { chatLogs, chatRoomInfo, callRequest, currVideoCallId, currCallId, }
    } = useSelector((state: RootState) => state);


    const dispatch = useAppDispatch()

    const roomInfo = useMemo(
        () => chatRoomInfo[props.roomId],
        [props.roomId, chatRoomInfo[props.roomId]]
    )

    useEffect(() => {
        socket.emit('chatClient_getRoom', { body: { chatRoomId: props.roomId } })
        socket.emit('chatClient_getChatLog', { body: { chatRoomId: props.roomId } })
    }, [props.roomId])
    function handleCall() {
        if (!currVideoCallId && !currCallId) {
            dispatch(chatAction.startCall(props.roomId))
        }
    }
    function handleVideoCall() {
        if (!currVideoCallId && !currCallId) {
            dispatch(chatAction.startVideoCall(props.roomId))
        }
    }
    function handleSendMessage(messageData: Omit<MessageReq, "chatRoomId">) {
        socket.emit('chatClient_sendRoomMessage', {
            body: { ...messageData, chatRoomId: props.roomId, }
        }, (res: any) => console.log(res?.status))
    }

    return (
        <div className='h-full flex flex-col gap-1'>
            <div className="background flex justify-between w-full p-1 rounded-lg">
                <div className='flex items-center gap-2 '>
                    <img src="/public/no-avatar.png" className="w-8 h-8 object-cover rounded-full m-2 self-end" alt="user avatar" />
                    <span>{roomInfo?.roomName}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button className="flex items-center p-2 rounded-full" onClick={handleVideoCall}>
                        <BsCameraVideoFill />
                    </Button>
                    <Button className="flex items-center p-2 rounded-full" onClick={handleCall}>
                        <BsTelephoneFill />
                    </Button>
                    <Button className="flex items-center p-2 rounded-full" >
                        <BsThreeDotsVertical />
                    </Button>
                </div>
            </div>
            <div className="flex-1 background ">
                <ul className="mt-3 max-h-[calc(100vh-210px)] custom-scrollbar overflow-x-auto
                flex flex-col-reverse">
                    {
                        chatLogs[props.roomId]?.length && chatLogs[props.roomId]?.map((msg, i) => {
                            return (
                                <ChatMessage chatMessage={msg} key={i} />
                            )
                        })
                    }
                </ul>
            </div>
            <ChatInput onSend={(messageData) => handleSendMessage(messageData)} />
        </div>
    )
}

export default memo(Conversation)