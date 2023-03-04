import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { useEffect } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export interface LoginFormData extends Pick<User, 'username' | 'password'> { }

type PropTypes = {
    className?: string
    onSubmit?: (data: LoginFormData) => void
}
const schema = yup.object({
    username: yup.string().required('Bắt buộc.'),
    password: yup.string().required('Bắt buộc.')
})

function LoginForm({ className, onSubmit }: PropTypes) {

    const { register, handleSubmit, control, trigger, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(schema)
    })

    const handleOnSubmit = handleSubmit((data) => {
        if (onSubmit) onSubmit(data);
    })

    return (
        <form className={"max-w-[500px] " + className} onSubmit={handleOnSubmit}>

            <FormInput
                label="Tài khoản:"
                field={register("username")}
                placeholder="Enter username"
                errorMessage={errors.username?.message}
            />
            <FormInput
                label="Mật khẩu:"
                field={register("password")}
                type="password"
                placeholder="Enter password"
                errorMessage={errors.password?.message}
            />

            <div className="flex justify-end">
                <Button className="p-2 m-4 outline outline-2">
                    <input type="submit" className="cursor-pointer" value="Xác nhận" />
                </Button>
            </div>
        </form>
    )
}

export default LoginForm