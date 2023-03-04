import { PropsWithChildren, ReactNode } from 'react'

interface PropTypes {
    children?: React.ReactNode;
    className?: string
    border?: boolean
    active?: boolean
    onClick?: () => void;
}

function Button(props: PropTypes) {
    const textStyle = 'text-left text-slate-600 active:text-gray-400 dark:text-gray-200 dark:active:text-gray-300'
    const bgStyle = 'hover:bg-slate-300 active:bg-slate-200 dark:hover:bg-gray-600'
    const utilStyle = 'cursor-pointer select-none rounded-md transition-colors ease-out'
    const borderStyle = 'border border-sky-400'
    const activeStyle = props.active ? 'text-sky-400 dark:active:text-sky-400 bg-slate-300 dark:bg-gray-600' : ''

    return (
        <button
            className={`${textStyle} ${bgStyle} ${utilStyle} ${props.border && borderStyle} ${activeStyle} ${props.className}`}
            onClick={() => props.onClick && props.onClick()}
        >
            {props.children}
        </button>
    )
}

export default Button