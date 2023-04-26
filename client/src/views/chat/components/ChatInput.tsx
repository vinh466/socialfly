import Button from '@/components/Button'
import { Message, MessageReq } from '@/types/chat.type'
import React, { useState } from 'react'
import { BsFillFileEarmarkImageFill } from 'react-icons/bs'


interface PropTypes {
    onSend?: (msg: Omit<MessageReq, "chatRoomId">) => void
}
function ChatInput({ onSend }: PropTypes) {
    const [messageInput, setMessageInput] = useState('')
    function handleEnterInput() {
        const msg: Omit<MessageReq, "chatRoomId"> = {
            parentId: null,
            messageBody: messageInput
        }
        onSend && messageInput && onSend(msg)
        setMessageInput('')
    }
    return (<>
        <div className='border-t border-gray-400 rounded-lg overflow-hidden'>
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
                Gửi
            </label>
            <div className="relative dark:focus:bg-gray-700 dark:bg-gray-700 flex">
                {/* <div className='flex items-center mx-1'>
                    <Button className='p-1 px-2'><BsFillFileEarmarkImageFill /></Button>
                </div> */}
                <input
                    id="default-search"
                    className="block w-full p-4 px-3 text-sm text-gray-900 dark:placeholder-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700 dark:hover:bg-slate-600 "
                    placeholder="tin nhắn ..."
                    value={messageInput}
                    autoComplete='off'
                    onChange={(e) => { setMessageInput(e.target.value) }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleEnterInput() }}
                />

                <Button
                    className="absolute right-2.5 bottom-1.5 font-medium rounded-lg text-sm px-4 py-2 border-slate-800"
                    background
                    onClick={() => handleEnterInput()}
                >
                    Gửi
                </Button>

            </div>
        </div>
    </>
    )
}

export default ChatInput