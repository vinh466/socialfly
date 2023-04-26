import { RootState } from "@/store";
import { chatAction } from "@/store/chat.slice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallModal from "./CallModal";
import VideoCallChat from "./VideoCallChat";
import CallChat from "./CallChat";

function Call() {
    const dispatch = useDispatch()
    const {
        callRequest,
        currVideoCallId,
        currCallId,
        chatRoomInfo } = useSelector((state: RootState) => state.chat)

    useEffect(() => { callRequest && console.log(callRequest); }, [callRequest])
    if (chatRoomInfo[currVideoCallId || currCallId || '']) {
        const a = chatRoomInfo[currVideoCallId || currCallId || '']
        const ste = a?.id
    }
    const endCallHandle = () => {
        dispatch(chatAction.endCall())
    }


    return (<>
        {callRequest && <CallModal request={callRequest} />}
        {
            currCallId && !currVideoCallId && <>{
                (() => {
                    const roomInfo = chatRoomInfo[currCallId]
                    const chatRoomId = roomInfo?.id
                    return chatRoomId && roomInfo && (
                        <CallChat roomInfo={roomInfo} onFinished={() => { endCallHandle() }} />
                    )
                })()
            }</>
        }
        {
            currVideoCallId && !currCallId && <>{
                (() => {
                    const roomInfo = chatRoomInfo[currVideoCallId]
                    const chatRoomId = roomInfo?.id
                    return chatRoomId && roomInfo && (
                        <VideoCallChat roomInfo={roomInfo} onFinished={() => { endCallHandle() }} />
                    )
                })()
            }</>
        }
    </>
    )
}
export default Call