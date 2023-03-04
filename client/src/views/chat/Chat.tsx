import { useState, useEffect, useContext, useCallback } from 'react'
import ConversationList from './components/ConversationList'
import Conversation from './components/Conversation'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';


function Chat() {
    // const { socket } = useContext(SocketContext)
    const [roomId, setRoomId] = useState("");

    const { userInfo } = useSelector((state: RootState) => state.auth);

    return (
        <div className='h-full flex flex-row gap-4'>

            {userInfo && (
                <>
                    <div className="flex-[4] background overflow-hidden">
                        {roomId ?
                            <Conversation roomId={roomId} />
                            :
                            <h4 className='p-3'>Chưa chọn phòng</h4>
                        }
                    </div>
                    <div className="flex-1 background">
                        <ConversationList
                            onChangeRoom={(newRoomId) => { setRoomId(newRoomId) }}
                        />
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