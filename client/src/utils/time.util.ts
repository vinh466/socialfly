const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',]
type DateFormat = 'ww, hh:mm, dd tháng mm, yy' | 'hh:mm, dd tháng mm, yy' | 'ww, hh:mm'

function getTimeString(time: Date, format: DateFormat = 'hh:mm, dd tháng mm, yy') {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const weekday = weekdays[time.getDay()];

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    if (format === 'ww, hh:mm')
        return `${weekday}, ${hours}:${minutes}`
    if (format === 'hh:mm, dd tháng mm, yy')
        return `${hours}:${minutes}, ${day} tháng ${month}, ${year}`

    return `${weekday}, ${hours}:${minutes}, ${day} tháng ${month}, ${year}`
}
function getMinuteAgoString(lapse: number) {
    return Math.floor(lapse / 60000) + ' phút trước'
}
function getHoursAgoString(lapse: number) {
    return Math.floor(lapse / 60000 / 60) + ' giờ trước'
}
export function getMessageTime(time: string | number | Date) {
    const timeConvert = new Date(time)
    if (timeConvert.toString() === 'Invalid Date') return ''
    const lapse = (new Date()).getTime() - timeConvert.getTime()
    if (lapse < 1000 * 60) return 'vừa xong'
    if (lapse < 1000 * 60 * 60) return getMinuteAgoString(lapse)
    if (lapse < 1000 * 60 * 60 * 24) return getHoursAgoString(lapse)
    if (lapse < 1000 * 60 * 60 * 24 * 7) return getTimeString(timeConvert, 'ww, hh:mm')
    if (lapse < 1000 * 60 * 60 * 24 * 30) return getTimeString(timeConvert, 'ww, hh:mm, dd tháng mm, yy')

    return getTimeString(timeConvert, 'hh:mm, dd tháng mm, yy')
}
// let test = 365
// let testNow = new Date().getTime()
// while (test > 0) {
//     console.log(getMessageTime(testNow));
//     testNow -= 1000 * 60 * 60 * 24

//     test--
// }