import classNames from 'classnames';
import { PropsWithChildren, ReactNode } from 'react'

interface PropTypes {
    children?: React.ReactNode;
    className?: string
    border?: boolean
    background?: boolean
    active?: boolean
    onClick?: () => void;
}

function Button(props: PropTypes) {
    return (
        <button
            className={classNames(
                'text-left text-slate-600 dark:text-gray-200 active:text-sky-600 dark:active:text-slate-400',
                'hover:bg-slate-300 dark:hover:bg-gray-600',
                'cursor-pointer select-none rounded-md transition-colors ease-out',
                { 'border border-sky-400 ': props.border },
                { 'bg-sky-400 hover:bg-sky-400 active:text-slate-200 text-white dark:bg-gray-600': props.active },
                { 'bg-sky-500 text-white dark:bg-sky-600': props.background },
                props.className
            )}
            onClick={() => props.onClick && props.onClick()}
        >
            {props.children}
        </button>
    )
}

export default Button