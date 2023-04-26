import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Portal from "./Portal";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill, BsFillTelephoneXFill, BsTelephoneFill, BsVolumeDownFill, BsVolumeMuteFill } from "react-icons/bs";
import classNames from "classnames";
import Webcam from "react-webcam";
import { SocketContext, SocketContextValue } from "./SocketContext";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { ClientEmit, ServerEmit } from "@/types/socket.type";
import { Peer } from "peerjs";
import { RoomInfo } from "@/utils/chat.util";
import { chatAction } from "@/store/chat.slice";

interface PropTypes {
    roomInfo: RoomInfo
    onFinished: (payload: any) => void
    messageFromPeer?: RTCSessionDescriptionInit
}

const videoConstraints = {
    width: 280,
    height: 220,
    facingMode: "user",
};

function VideoCallChat({ roomInfo, ...props }: PropTypes) {
    const {
        auth: { userInfo },
        chat: { callResponse, callRequest, callParticipants }
    } = useSelector((state: RootState) => state);
    const dispatch = useAppDispatch()
    const { socket, } = useContext(SocketContext) as SocketContextValue
    const [isPortalOpen, setPortalOpenState] = useState(true);
    const [callMode, setCallMode] = useState<'call' | 'cannot'>('call');
    const [isMicOn, setMicOn] = useState(true);
    const [webcamStart, setWebcamStart] = useState(false);
    const [isCamOn, setVideoOn] = useState(true);
    const [isMuted, setMuted] = useState(false);
    const [toastMessages, setToastMessages] = useState<Array<ToastMessage>>([]);
    const openPortal = useCallback(() => setPortalOpenState(true), []);
    const closePortal = useCallback(() => {
        setPortalOpenState(false);
    }, []);

    const peerInstance = useRef<Peer | null>(null);
    const localWebcamRef = useRef<Webcam>(null);
    const [remoteStream, setRemoteStream] = useState<{ [key: string]: MediaStream }>({});
    // const remoteWebcamRef = useRef<HTMLVideoElement>(null);

    const incomimg = useMemo(() => !!callRequest, [])

    useEffect(() => {
        const username = userInfo?.username
        if (!username) return
        console.log(peerInstance.current);
        peerInstance.current ||= new Peer(username);
        if (peerInstance.current.destroyed) peerInstance.current = new Peer(username);
        peerInstance.current.on('open', (id) => {
            console.log('open', id, peerInstance.current);
            if (!incomimg) socket.emit('chatClient_callRequest', {
                body: { chatRoomId: roomInfo.id, peerId: username, type: 'video call' }
            })
            setWebcamStart(true)
        });
        peerInstance.current.on('call', (call) => {
            console.log('recevied call from ', call.peer, call);
            call.answer(localWebcamRef.current?.stream!)
            console.log('rep', localWebcamRef.current?.stream!);
            call.on('stream', function (remoteStream) {
                setRemoteStream((old) => ({
                    ...old,
                    [call.peer]: remoteStream
                }))
            });
        })
        peerInstance.current.on('disconnected', (id) => {
            console.log('disconnected', id, peerInstance.current);
        });
        return () => {
            console.log('remove');
            peerInstance.current?.removeAllListeners()
        }
    }, [userInfo])

    useEffect(() => {
        console.log(callParticipants);
        const username = userInfo?.username
        const localStream = localWebcamRef.current?.stream!
        if (!localStream || !username) return
        console.log(callParticipants);

        callParticipants.forEach((participant) => {
            if (username === participant.peerId) return
            if (participant.status === 'connect') {
                console.log('peer open??', peerInstance.current?.open);
                const call = peerInstance.current?.call(participant.peerId, localStream);
                console.log("call " + participant.peerId, call);
                call?.on("stream", (remoteStream) => {
                    setRemoteStream((old) => ({
                        ...old,
                        [call.peer]: remoteStream
                    }))
                });
            }
        })
    }, [callParticipants, webcamStart, localWebcamRef.current?.stream,])

    useEffect(() => {
        if (callResponse) {
            let message = callResponse.peerId + ' '
            if (callResponse.type === 'has join') {
                message += 'đã tham gia'
            } else if (callResponse.type === 'deny') {
                message += 'đã từ chối'
            } else if (callResponse.type === 'has left') {
                message += 'đã rời khỏi'
            } else if (callResponse.type === 'time out') {
                message += 'không bắt máy'
            } else if (callResponse.type === 'busy') {
                message += 'đang bận'
            } else if (callResponse.type === 'has end') {
                message = 'Kết thúc cuộc gọi'
            } else if (callResponse.type === 'no online') {
                message = 'Đối phương không online'
            } else {
                message = callResponse.type || 'error'
            }
            if (callResponse.peerId !== userInfo?.username)
                setToastMessages((state) => ([
                    ...state,
                    { message: message, type: 'default' },
                ]))
            if (callResponse.type !== 'has join') {
                setCallMode('cannot')
                setRemoteStream({})
            }
            dispatch(chatAction.setCallResponse())
        }
    }, [callResponse])


    function handleReCall() {
        const username = userInfo?.username
        console.log('handleReCall', username);
        if (!username) return
        setCallMode('call')
        const cancelCall = setTimeout(() => {
            console.log('start call');
            socket.emit('chatClient_callRequest', {
                body: { chatRoomId: roomInfo.id, peerId: username, type: 'video call' }
            })
        }, 1000)
    }

    function handleCancel() {
        const username = userInfo?.username
        console.log('handleCancel', username);
        if (!username) return
        socket.emit('chatClient_callResponse', {
            body: { chatRoomId: roomInfo.id, peerId: username, type: 'cancel' }
        })
        peerInstance.current?.disconnect()
        dispatch(chatAction.endCall())
        props.onFinished({ msg: 'onFinish' })
    }

    const toggleCamera = async (turnOn: boolean | null = null) => {
        const localStream = localWebcamRef.current?.stream
        if (localStream) {
            const videoTrack = localStream.getTracks().find(track => track.kind === 'video')
            if (videoTrack) {
                if (turnOn !== null) videoTrack.enabled = turnOn
                else videoTrack.enabled = !videoTrack.enabled
                setVideoOn(!isCamOn)
            }
        }
    }

    const toggleMic = async (turnOn: boolean | null = null) => {
        const localStream = localWebcamRef.current?.stream
        if (localStream) {
            const audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
            if (audioTrack) {
                if (turnOn !== null) audioTrack.enabled = turnOn
                else audioTrack.enabled = !audioTrack.enabled
                setMicOn(!isMicOn)
            }
        }
    }
    const handleVolume = (turnOn: boolean | null = null) => {
        Object.values(remoteStream).forEach((stearm) => {

            const audioTrack = stearm.getAudioTracks()[0]
            if (audioTrack) {
                if (turnOn !== null) audioTrack.enabled = turnOn
                else audioTrack.enabled = !audioTrack.enabled

            }
        })
        setMuted((s) => !s)
    }
    return (
        <div>
            {(
                isPortalOpen &&
                <Portal
                    title="Gọi Video"
                    windowWidth={800}
                    windowHeight={600}
                    onPortalClose={() => {
                        closePortal()
                        props.onFinished({ msg: 'onFinish' })
                    }}
                >
                    <div className="flex flex-col items-center h-full relative">
                        <Webcam
                            className="absolute bottom-6 left-5 z-50 border border-gray-500"
                            width='160px'
                            height='120px'
                            audio={true}
                            ref={localWebcamRef}
                            muted
                        />
                        {!!Object.entries(remoteStream).length && <div className="flex flex-wrap h-full w-full">
                            {Object.entries(remoteStream).map(([peerId, stream]) => {
                                return <div key={peerId} className="flex-1 min-w-[200px] gap-2 relative">
                                    <h2 className="absolute top-2 right-2">{roomInfo.roomName}</h2>
                                    <video className="w-full h-full object-cover" autoPlay muted ref={(ref) => {
                                        if (ref) {
                                            ref.srcObject! = stream;
                                            ref.play();
                                            ref.muted = false
                                        }
                                    }}></video>
                                </div>
                            })}

                        </div>
                        }

                        {!Object.entries(remoteStream).length && <div className="flex-1 flex flex-col justify-center items-center">
                            <img src="http://127.0.0.1:5173/public/no-avatar.png" alt="avatar" className="w-[20vw] h-[20vw] object-cover rounded-full background p-1" />
                            <h1 className=''>{roomInfo.roomName}</h1>
                        </div>}
                        {callMode === 'cannot' &&
                            <div className="absolute bottom-24 z-50 flex flex-col gap-2">
                                <button
                                    className="bg-green-600 p-3 rounded-full"
                                    onClick={(() => {
                                        handleReCall()
                                    })}
                                >
                                    <BsTelephoneFill />
                                </button>
                                Gọi lại
                            </div>
                        }
                        <div className="p-3 flex gap-2 absolute bottom-5 z-50">
                            {<>
                                <button
                                    className={classNames("p-3 rounded-full bg-gray-600",
                                        { "bg-gray-200": isMicOn })}
                                    onClick={() => toggleMic()}
                                >
                                    {isMicOn ?
                                        <BsFillMicFill className="text-gray-600" /> :
                                        <BsFillMicMuteFill className="text-gray-200" />
                                    }
                                </button>
                                <button
                                    className={classNames("p-3 rounded-full bg-gray-600",
                                        { "bg-gray-200": !isMuted })}
                                    onClick={() => handleVolume()}
                                >
                                    {isMuted ?
                                        <BsVolumeMuteFill className="text-gray-200" /> :
                                        <BsVolumeDownFill className="text-gray-600" />
                                    }
                                </button>
                                <button
                                    className={classNames("p-3 rounded-full bg-gray-600",
                                        { "bg-gray-200": isCamOn })}
                                    onClick={() => toggleCamera()}
                                >
                                    {isCamOn ?
                                        <BsFillCameraVideoFill className="text-gray-600" /> :
                                        <BsFillCameraVideoOffFill className="text-gray-200" />
                                    }
                                </button>
                                <button
                                    className="bg-red-600 p-3 rounded-full text-gray-200"
                                    onClick={() => handleCancel()}
                                >
                                    <BsFillTelephoneXFill />
                                </button>
                            </>}
                        </div>
                        <div className="absolute bottom-6 right-6 z-60">
                            {!!toastMessages.length && <ToastMessageList toasts={toastMessages} setToastMessages={setToastMessages} />}
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
type ToastMessage = { message: string, type: 'default' | 'error' }
interface ToastMessageProps {
    toasts: Array<ToastMessage>
    setToastMessages: Dispatch<SetStateAction<ToastMessage[]>>
}
function ToastMessageList({ toasts, setToastMessages }: ToastMessageProps) {
    useEffect(() => {
        const clear = setInterval(() => {
            setToastMessages(([firis, ...state]) => state)
        }, 3000)
        return () => clearInterval(clear)
    }, [])
    return (<>{
        toasts.map(({ message, type }, i) => (
            <div key={i} className="background p-2 fade-in-right disappear-after-2 m-2">
                <span>{message}</span>
            </div>
        ))
    }</>
    )
}

export default VideoCallChat