const source = ('lorem ipsum dolor sit amet consectetur adipisicing elit ' +
    'non natus optio ratione nemo repudiandae perspiciatis eveniet eius ' +
    'beatae obcaecati enim doloribus dolores harum minima sequi aliquam ' +
    'nostrum corrupti mollitia qui soluta quasi at facere quae ' +
    'necessitatibus suscipit voluptatem obcaecati nesciunt a et nobis ' +
    'distinctio autem nemo magni quisquam repudiandae doloremque sed ' +
    'reprehenderit magnam deserunt ipsa voluptatum minus vero accusamus quasi').split(' ')


export function generateSentence(length = 10) {
    let len = Math.ceil(Math.random() * length)
    let sentence = ''
    while (len > 0) {
        const random = Math.floor(Math.random() * source.length)
        sentence += source[random] + ' '
        len--
    }
    return sentence
}
export function getRandomElement<T>(arr: Array<T>): T | undefined {
    if (arr.length === 0) return undefined
    const random = Math.floor(Math.random() * arr.length)
    return arr[random]
}