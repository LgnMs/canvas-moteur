export function generateId({prefix = '', suffix = ''}: {prefix?: string, suffix?: string}) {
    const id = new Date().getTime();

    return `${prefix}${id}${suffix}`
}