let oldtime = 0;
let time = 0;

export function generateId({prefix = '', suffix = ''}: {prefix?: string, suffix?: string}) {
    const id = new Date().getTime();
    if (oldtime === id) {
        time += 1;
    } else {
        time = 0;
    }
    oldtime = id;

    return `${prefix}${id}${time}${suffix}`
}
