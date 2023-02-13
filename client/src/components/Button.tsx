import { PropsWithChildren, ReactNode } from 'react'

type ButtonProps = {
    children?: ReactNode | undefined;
    className?: string | undefined;
}

function Button(props: ButtonProps) {
    return (
        <div
            className={`flex w-full items-center gap-1 rounded-md cursor-pointer transition-colors ease-out select-none hover:bg-slate-300 active:bg-slate-200 dark:hover:bg-gray-600 dark:active:text-sky-400 ${props.className}`}
        >
            {props.children}
        </div>
    )
}

export default Button