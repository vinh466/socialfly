import React, { useEffect, useState } from 'react'
import { BsFillCloudMoonFill, BsFillCloudSunFill } from 'react-icons/bs'
function ThemeToggleBtn({ className }: { className?: string }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    useEffect(() => {
        document.documentElement.dataset.mode = theme;
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <label htmlFor="ThemeToggleButton" className={"block relative h-8 w-14 cursor-pointer " + className}>
            <input
                type="checkbox"
                id="ThemeToggleButton"
                className="peer sr-only [&:checked_+_span_svg[data-unchecked-icon]]:hidden [&:checked_+_span_svg[data-checked-icon]]:block"
                checked={theme == 'dark'}
                onChange={() => setTheme(theme == 'dark' ? 'light' : 'dark')}
            />

            <span
                className="absolute inset-0 z-10 m-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 peer-checked:bg-dark text-sky-500 transition  peer-checked:text-white peer-checked:translate-x-6"
            >
                <BsFillCloudMoonFill data-checked-icon className="hidden h-4 w-4" />

                <BsFillCloudSunFill data-unchecked-icon className=" h-4 w-4" />

            </span>

            <span
                className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-slate-600 peer-hover:bg-slate-400"
            ></span>
        </label>

    )
}

export default ThemeToggleBtn