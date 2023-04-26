import Button from '@/components/Button'
import { RootState } from '@/store'
import axios from 'axios'
import classNames from 'classnames'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsFillFileImageFill, BsXLg } from 'react-icons/bs'
import { useSelector } from 'react-redux'

function PostCreate({ onUpdate }: { onUpdate?: () => void }) {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const [isEdit, setIsEdit] = useState(false)
    const inputFile = useRef<HTMLInputElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const [selectedFile, setSelectedFile] = useState()
    const [title, setTitle] = useState('')
    const [preview, setPreview] = useState<string>()

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => { document.removeEventListener('click', handleClick) }

    }, [])
    const handleClick = (event: any) => {
        const { target } = event
        if (!wrapperRef.current?.contains(target)) {
            setIsEdit(false)
        } else {
            setIsEdit(true)
        }
    }
    const onSelectFile = (e: any) => {
        if (!(e.target as HTMLInputElement).files || (e.target as HTMLInputElement).files?.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }
    const handleCreatePost = async () => {
        if (!title && !selectedFile) return
        var formData = new FormData();
        if (selectedFile) {
            formData.append("image", selectedFile)
        }
        formData.append("title", title)
        const result = await axios.post('http://localhost:3200/api/post/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': userInfo?.accessToken
            }
        })
        console.log(result);
        if (result.status === 200) {
            setSelectedFile(undefined)
            setPreview(undefined)
            setTitle('')
            onUpdate && onUpdate()
            toast('Đã thêm bài!')
        }
    }

    return (
        <div className='background w-full p-3'
            ref={wrapperRef}
        >
            <div className="flex flex-row  ">
                <img src={userInfo?.avatar || '/public/no-avatar.png'} className="rounded-4xl w-12 h-12 object-cover" alt="avatar" width={50} height={50} />
                <div className='flex-1 ml-3 w-full '>
                    <textarea
                        className={"rounded-lg  p-2 w-full bg-slate-100 hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600 transition-all "}
                        placeholder="Hãy đăng gì đó "
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className='flex justify-center'>
                        {selectedFile && <img src={preview} className=' mx-3' />}
                    </div>
                    <input
                        type='file'
                        id='file'
                        ref={inputFile}
                        className='hidden'
                        onChange={(e) => onSelectFile(e)}
                    />
                </div>
            </div>
            {(isEdit || preview) && <div className='flex justify-end gap-2 mt-3'>
                {preview && <Button
                    className='p-1 flex items-center gap-1'
                    onClick={() => {
                        setPreview(undefined)
                    }}
                >
                    <BsXLg /> Xóa ảnh
                </Button>}
                <Button
                    className='p-1 flex items-center gap-1'
                    onClick={() => {
                        inputFile.current?.click();
                    }}
                >
                    <BsFillFileImageFill />{preview ? 'Đổi ảnh' : 'Thêm ảnh'}
                </Button>
                <Button background className='p-1 px-4' onClick={handleCreatePost}>Tạo</Button>
            </div>}
        </div>

    )
}

export default PostCreate