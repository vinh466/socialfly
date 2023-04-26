import { RootState } from "@/store"
import { Message, SystemMessage } from "@/types/chat.type"
import { getMessageTime } from "@/utils/time.util"
import classNames from "classnames"
import { useMemo } from "react"
import { BsCameraVideoFill, BsFillCameraVideoOffFill, BsFillTelephoneFill, BsFillTelephoneXFill, BsTelephoneInboundFill, BsTelephoneOutboundFill } from "react-icons/bs"
import { useSelector } from "react-redux"

type PropTypes = {
    chatMessage: Message | Message[]
}
function getMessageInfo(chatMessage: Message | Message[]) {
    if (chatMessage instanceof Array) {
        return chatMessage[chatMessage.length - 1]
    } else {
        return chatMessage
    }
}
function ChatMessage({ chatMessage }: PropTypes) {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const messageInfo = getMessageInfo(chatMessage)

    const { username, firstname, lastname, avatar } = messageInfo.creator
    const { id, messageBody, createdAt, messageSystem } = messageInfo
    const isSelf = userInfo?.username === messageInfo.creator.username

    const fullname = useMemo(() => {
        if (firstname && lastname) return [firstname, lastname].join(' ')
        return username || 'unknown'
    }, [username, firstname, lastname])

    return (
        <>
            <div className={classNames("flex mb-3", { "flex-row-reverse": isSelf })}>
                {!isSelf &&
                    <img src={avatar || "/public/no-avatar.png"} className="w-6 h-6 object-cover rounded-full m-2 " alt="user avatar" />
                }
                <div className={classNames("flex flex-col ", {
                    "mr-8": !isSelf, "mr-2 ml-8": isSelf,
                })}>
                    {!isSelf &&
                        <div className={classNames({ "text-right": isSelf })}>
                            <span className="text-xs font-bold text-gray-300 mx-1">{fullname}</span>
                        </div>
                    }
                    {chatMessage instanceof Array ?
                        chatMessage.map((message, index, arr) => (
                            <div className={classNames(
                                "py-2", {
                                "text-right": isSelf,
                            })} key={message.id}>
                                <span className={classNames(
                                    "bg-slate-200 dark:bg-slate-600 p-2 px-3",
                                    { "dark:bg-sky-700": isSelf },
                                    "rounded-2xl",
                                    isSelf && {
                                        "rounded-r-md": true,
                                        "rounded-tr-2xl": index === 0,
                                        "rounded-br-2xl": index === arr.length - 1
                                    },
                                    !isSelf && {
                                        "rounded-l-md": true,
                                        "rounded-tl-2xl": index === 0,
                                        "rounded-bl-2xl": index === arr.length - 1
                                    }
                                )}
                                    title={getMessageTime(message.createdAt)}
                                >
                                    <MessageContent
                                        messageBody={message.messageBody}
                                        messageSystem={message.messageSystem}
                                    />
                                </span>
                            </div>
                        ))
                        :
                        <div className={classNames("py-2", { "text-right": isSelf })} key={id}>
                            <span className={classNames(
                                "bg-slate-200 dark:bg-slate-600 p-2 px-3",
                                { "dark:bg-sky-700": isSelf },
                                "rounded-2xl"
                            )}
                                title={getMessageTime(createdAt)}>
                                <MessageContent
                                    messageBody={messageBody}
                                    messageSystem={messageSystem}
                                />
                            </span>
                        </div>
                    }

                    <div className={classNames("text-xs text-gray-400 mx-1", {
                        "text-right": isSelf,
                    })}>{getMessageTime(createdAt)}</div>
                </div>

            </div>
        </>
    )
}
function MessageContent({ messageSystem, messageBody }: { messageSystem?: SystemMessage, messageBody: string }) {

    return <>
        {messageSystem ?
            <>
                {messageSystem.type === 'system' ?
                    <span>Không thể nhận cuộc gọi</span>
                    :
                    <>
                        {(() => {
                            const type = messageSystem.type
                            const seconds = parseInt(messageSystem.messageBody[0]?.time) || 0
                            if (seconds && type === 'call') return <BsFillTelephoneFill className="mr-2" />
                            if (!seconds && type === 'call') return <BsFillTelephoneXFill className="mr-2" />
                            if (seconds && type === 'video call') return <BsCameraVideoFill className="mr-2" />
                            if (!seconds && type === 'video call') return <BsFillCameraVideoOffFill className="mr-2" />
                            return 'err '
                        })()}
                        <span className="text-xs">
                            {(() => {
                                const seconds = parseInt(messageSystem.messageBody[0]?.time) || 0
                                if (seconds === 0) return 'Gọi nhỡ'
                                return new Date(seconds * 1000).toISOString().slice(14, 19)
                            })()}
                        </span>
                    </>
                }
            </>
            :
            messageBody
        }
    </>
}

export default ChatMessage