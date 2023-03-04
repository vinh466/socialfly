import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { useEffect } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import CalendarInput from "@/components/CalendarInput";


export interface RegisterFormData extends Pick<User, 'username' | 'password' | 'firstname' | 'lastname'> {
    rePassword: string
    gender: string
    dayBirth: string
    monthBirth: string
    yearBirth: string
}

type PropTypes = {
    className?: string
    onSubmit?: (data: RegisterFormData) => void
}
const schema = yup.object<RegisterFormData>({
    username: yup.string().required('Bắt buộc.'),
    password: yup.string().required('Bắt buộc.'),
    rePassword: yup.string().required('Bắt buộc.')
        .oneOf([yup.ref('password')], 'Không khớp'),
    firstname: yup.string().required('Bắt buộc.'),
    lastname: yup.string().required('Bắt buộc.'),
    gender: yup.string().required('Bắt buộc.'),
    dayBirth: yup.string().required('Bắt buộc.'),
    monthBirth: yup.string().required('Bắt buộc.'),
    yearBirth: yup.string().required('Bắt buộc.')
})

function RegisterForm({ className, onSubmit }: PropTypes) {

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(schema)
    })

    const handleOnSubmit = handleSubmit((data) => {
        if (onSubmit) onSubmit(data);
    })

    return (
        <form className={"w-full max-w-[500px]" + className} onSubmit={handleOnSubmit}>
            <FormInput
                label="Tài khoản:"
                field={register("username")}
                placeholder=""
                errorMessage={errors.username?.message}
            />
            <div className="flex">
                <FormInput
                    className="flex-1"
                    label="Mật khẩu:"
                    field={register("password")}
                    type="password"
                    placeholder=""
                    errorMessage={errors.password?.message}
                />
                <FormInput
                    className="flex-1"
                    label="Nhập lại mật khẩu:"
                    field={register("rePassword")}
                    type="password"
                    placeholder=""
                    errorMessage={errors.rePassword?.message}
                />
            </div>
            <div className="flex">
                <FormInput
                    className="flex-1"
                    label="Tên:"
                    field={register("firstname")}
                    placeholder=""
                    errorMessage={errors.password?.message}
                />
                <FormInput
                    className="flex-1"
                    label="Họ:"
                    field={register("lastname")}
                    placeholder=""
                    errorMessage={errors.password?.message}
                />
            </div>
            <div className="flex items-center">
                <div className="flex-1 flex items-center m-2">
                    <label htmlFor="gender" className="text-sm font-medium mx-1">Giới tính:</label>
                    <div className="mx-3 flex">
                        <label htmlFor="gender-1" className="ml-1 mr-3">
                            <input type="radio" {...register('gender')} value="male" id="gender-1" />
                            Nam
                        </label>
                        <label htmlFor="gender-2" className="mx-1">
                            <input type="radio" {...register('gender')} value="female" id="gender-2" />
                            Nữ
                        </label>
                    </div>
                    <span className="text-sm text-error">{errors.gender?.message}</span>
                </div>
                <div className="flex-1 m-2">
                    <CalendarInput
                        label="Ngày sinh:"
                        dayField={register('dayBirth')}
                        monthField={register('monthBirth')}
                        yearField={register('yearBirth')}
                        errorMessage={errors.dayBirth?.message || errors.monthBirth?.message || errors.yearBirth?.message}
                    />

                </div>
            </div>

            <div className="flex justify-end">
                <Button className="p-2 m-4 outline outline-2">
                    <input type="submit" className="cursor-pointer" value="Xác nhận" />
                </Button>
            </div>
        </form>
    )
}

export default RegisterForm