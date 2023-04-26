import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import ConversationList from './components/ConversationList'
import Conversation from './components/Conversation'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';
import { useParams } from 'react-router-dom';
import { useGetRoomListQuery } from '@/services/chat.service';
import { SocketContext, SocketContextValue } from '@/components/SocketContext';


function Chat() {
    // const { socket } = useContext(SocketContext)  
    let { roomId } = useParams();
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { socket } = useContext(SocketContext) as SocketContextValue
    useEffect(() => {
        socket.emit('chatClient_getRoomList',)
    }, [])
    return (
        <div className='h-full flex flex-row gap-2'>
            {userInfo && (
                <>
                    <div className="flex-[4] overflow-hidden ">
                        {roomId ?
                            <Conversation roomId={roomId} />
                            :
                            <h4 className='p-3 text-center h-full background'></h4>
                        }
                    </div>
                    <div>
                    </div>
                    <div className="flex-1 background">
                        {<ConversationList />}
                    </div>
                </>
            )}

            {!userInfo &&
                <div className="flex-1 background flex justify-center">
                    user not found
                </div>
            }
        </div>
    )
}

export default Chat