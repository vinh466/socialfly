import Button from '@/components/Button'
import { RootState, useAppDispatch } from '@/store'
import { authAction } from '@/store/auth.slice'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsCheckCircle, BsPencilSquare } from 'react-icons/bs'
import { useSelector } from 'react-redux'

function UpdateAvatar({ avatar, onUpdate }: { avatar?: string, onUpdate?: () => void }) {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const inputFile = useRef<HTMLInputElement | null>(null)
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState<string>()

    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = (e: any) => {
        if (!(e.target as HTMLInputElement).files || (e.target as HTMLInputElement).files?.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }
    const handleCreatePost = async () => {
        if (!selectedFile) return
        var formData = new FormData();
        formData.append("image", selectedFile)
        try {
            const result = await axios.post('http://localhost:3200/api/auth/updateAvatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': userInfo?.accessToken
                }
            })
            console.log(result);
            if (result.status === 200) {
                dispatch(authAction.setAvatar(result?.data?.avatar || ''))
                onUpdate && onUpdate()
                toast('Đã thay ảnh!')
            }
        } catch (err) {
            console.log(err);
            toast('Lưu thất bại, xin thử lại!')
        } finally {
            setSelectedFile(undefined)
            setPreview(undefined)
        }
    }
    return (
        <div className="w-32">
            <div className="background rounded-full p-1 relative">
                <img src={preview || avatar || '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-28 h-28 m-1" />
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2'>
                    <Button background className=' rounded-full p-2 flex items-center'
                        onClick={() => {
                            inputFile.current?.click();
                        }}
                    >
                        <BsPencilSquare />
                    </Button>
                    {preview && <Button background className='rounded-full p-2 flex items-center'
                        onClick={() => {
                            handleCreatePost()
                        }}
                    >
                        <BsCheckCircle />
                    </Button>}
                </div>
            </div>
            <input
                type='file'
                id='file'
                ref={inputFile}
                className='hidden'
                onChange={(e) => onSelectFile(e)}
            />
        </div>
    )
}

export default UpdateAvatar