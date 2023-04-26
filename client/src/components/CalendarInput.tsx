import { rangeArray } from '@/utils/array.util';
import { useEffect, useState } from 'react';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
type PropTypes = {
    label?: string
    dayField: UseFormRegisterReturn<string>
    monthField: UseFormRegisterReturn<string>
    yearField: UseFormRegisterReturn<string>
    type?: 'password' | 'select' | 'text' | 'number'
    placeholder?: string
    required?: boolean
    errorMessage?: string
    className?: string
}

function CalendarInput({ label, dayField, monthField, yearField, errorMessage, type = 'text', placeholder, className }: PropTypes) {
    const selectCSS = 'select-scrollbar rounded-md p-2 mr-1 bg-slate-200 hover:bg-slate-300 focus:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-slate-500'
    const currentYear = (new Date()).getFullYear()

    const [dayList, setDayList] = useState(rangeArray(1, 31))
    const [currDay, setCurrDay] = useState('1')

    const [monthList, setMonthList] = useState(rangeArray(1, 12))
    const [currMonth, setCurrMonth] = useState('1')

    const [yearList, setYearList] = useState(rangeArray(currentYear, currentYear - 70))
    const [currYear, setCurrYear] = useState('2023')

    const handleChangeTime = ({ newDay, newMonth, newYear }: { [key: string]: string | undefined }) => {
        newDay && setCurrDay(newDay)
        newMonth && setCurrMonth(newMonth)
        newYear && setCurrYear(newYear)
    }
    useEffect(() => {
        const day = parseInt(currDay) || 1
        const month = parseInt(currMonth) || 1
        const year = parseInt(currYear) || 2020
        setDayList(getDayList(month, year) as number[])
        setMonthList(getMonthList(day, year) as number[])
        const newyearList = getYearList(day, month) as number[]
        newyearList && setYearList(newyearList)
    }, [currDay, currMonth, currYear])

    const getDayList = (month: number, year: number) => {
        const dayAmount = new Date(year, month, -1).getDate() + 1
        return rangeArray(1, dayAmount)
    }
    const getMonthList = (day: number, year: number) => {
        return rangeArray(1, 12).filter((v, i) => {
            let monthDay = new Date(year, v, -1).getDate()
            return monthDay >= day - 1
        })
    }
    const getYearList = (day: number, month: number) => {
        if (day === 29 && month === 2) {
            let leapYear = nearestLeapYear(currentYear);
            return rangeArray(leapYear, currentYear - 70, 4)
        }
    }
    const nearestLeapYear = function (year: number) {
        let yearLoop = year || 2020
        while (yearLoop > 2020) {
            if ((yearLoop % 4 === 0 && yearLoop % 100 !== 0 && yearLoop % 400 !== 0) || (yearLoop % 100 === 0 && yearLoop % 400 === 0)) {
                return yearLoop;
            } else {
                yearLoop--;
            }
        }
        return yearLoop;
    };
    return (
        <div className={`min-w-[245px] flex flex-col m-2 transition-transform ${className}`}>
            {dayField && dayField.name && monthField && monthField.name && yearField && yearField.name ?
                <>
                    {label &&
                        <label className='text-sm font-medium m-1'>
                            {label}
                            <span className='text-sm mx-1 text-error'> {errorMessage}</span>
                        </label>
                    }
                    <div>
                        <select {...dayField} value={currDay} className={selectCSS}
                            onChange={(v) => handleChangeTime({ newDay: v.target.value })}
                        >
                            <option value="" disabled hidden>Ngày</option>
                            {dayList.map((v, i) => (<option value={v} key={'day' + v + i}>{v}</option>))}
                        </select>
                        <select {...monthField} value={currMonth} className={selectCSS}
                            onChange={(v) => handleChangeTime({ newMonth: v.target.value })}
                        >
                            <option value="" disabled hidden>Tháng</option>
                            {monthList.map((v, i) => (<option value={v} key={'month' + v + i}>{v}</option>))}
                        </select>
                        <select {...yearField} value={currYear} className={selectCSS}
                            onChange={(v) => handleChangeTime({ newYear: v.target.value })}
                        >
                            <option value="" disabled hidden>Năm</option>
                            {yearList.map((v, i) => (<option value={v} key={'year' + v + i}>{v}</option>))}
                        </select>
                    </div>
                </>
                :
                <span>No register input</span>
            }
        </div>
    )
}

export default CalendarInput