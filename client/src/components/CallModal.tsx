import { BsCameraVideoFill, BsTelephoneFill, BsXCircleFill, BsXLg } from "react-icons/bs";
import Button from "./Button";
import { CallRequest, MessageFromPeer } from "@/types/chatRTC.type";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { chatAction } from "@/store/chat.slice";
import { SocketContext, SocketContextValue } from "./SocketContext";
import ReactModal from "react-modal";
interface PropTypes {
    request: CallRequest
}
const customStyles: ReactModal.Styles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0px',
        transform: 'translate(-50%, -50%)',
        background: 'none',
        zIndex: 9999,

    },
};
function CallModal({ request }: PropTypes) {
    const { auth: { userInfo }, chat: { currVideoCallId, currCallId, callRequest } } = useSelector((state: RootState) => state)
    const { socket } = useContext(SocketContext) as SocketContextValue

    const [modalIsOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    // useEffect(() => {
    //     enableModal()
    //     return () => { disableModal() }
    // }) 
    const handlePeer = () => {
        const username = userInfo?.username
        if (!username) return
        socket.emit('chatClient_callResponse', {
            body: { chatRoomId: request.chatRoomId, peerId: username, type: 'accept' }
        })
        request.type === 'call' && dispatch(chatAction.startCall(request.chatRoomId))
        request.type === 'video call' && dispatch(chatAction.startVideoCall(request.chatRoomId))
        closeModal()
    }
    const handleIgnore = () => {
        dispatch(chatAction.setCallRequest())
        closeModal()
    }
    const handleCancel = () => {
        const username = userInfo?.username
        if (!username) return
        socket.emit('chatClient_callResponse', {
            body: { chatRoomId: request.chatRoomId, peerId: username, type: 'deny' }
        })
        dispatch(chatAction.setCallRequest())
        closeModal()
    }
    useEffect(() => {
        openModal()
        return () => {
            console.log('unCallModal');
            closeModal()
        }
    }, [])

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }
    return (
        <ReactModal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            // onRequestClose={closeModal}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="relative bg-white rounded-lg dark:bg-gray-700">

                <Button
                    className="absolute top-1 right-0.5 mr-1 py-1 px-2  "
                    onClick={handleIgnore}
                >
                    <BsXLg />
                    <span className="sr-only">Close modal</span>

                </Button>
                <div className="p-8 text-center">
                    <div className="mb-5">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <img src={request.roomInfo.roomAvatar} alt="avatar" className="w-[10vw] h-[10vw] object-cover rounded-full background p-1" />
                            <h1 className=''>{request.roomInfo.roomName}</h1>

                        </div>
                    </div>
                    <div className="flex flex-row justify-center">
                        {callRequest?.type === 'video call' && <Button className="flex items-center mx-2 p-3 bg-green-500 text-gray-100 hover:text-green-500 hover:bg-gray-200 rounded-full"
                            onClick={handlePeer} >
                            <BsCameraVideoFill />
                        </Button>}
                        {callRequest?.type === 'call' && <Button className="flex items-center mx-2 p-3 bg-green-500 text-gray-100 hover:text-green-500 hover:bg-gray-200 rounded-full"
                            onClick={handlePeer} >
                            <BsTelephoneFill />
                        </Button>}
                        <Button className="flex items-center mx-2 p-3 bg-red-500 text-gray-100 hover:text-red-500 hover:bg-gray-200 rounded-full"
                            onClick={handleCancel}>
                            <BsXCircleFill />
                        </Button>
                    </div>
                </div>
            </div>

        </ReactModal>
    )
}

export default CallModal