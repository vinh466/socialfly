import React from 'react'

function ChatInput() {
    return (
        <form className='border-t border-gray-400'>
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
                Gửi
            </label>
            <div className="relative  ">
                <input
                    type="search" id="default-search"
                    className="block w-full p-4 text-sm text-gray-900 dark:placeholder-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700 dark:hover:bg-slate-600 dark:focus:bg-gray-700"
                    placeholder="tin nhắn ..." required
                />

                <button
                    type="submit"
                    className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Gửi
                </button>

            </div>
        </form>

    )
}

export default ChatInput