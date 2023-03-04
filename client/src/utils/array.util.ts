export const rangeArray = (from: number, to?: number, step: number = 1) => {
    if (!to && to !== 0) {
        return Array.from({ length: Math.abs(from) }, (v, i) => i * step)
    }
    if (from === to) {
        return [from]
    }
    if (from < to) {
        let length = Math.ceil((to - from + 1) / step)
        return Array.from({ length }, (v, i) => i * step + from)
    }
    if (from > to) {
        let length = Math.ceil((from + 1 - to) / step)
        return Array.from({ length }, (v, i) => from - i * step)
    }
    return []
}
// 1 3 4 7 9
// 1 4 7 10
// 1 5 9