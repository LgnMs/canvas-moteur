export enum logLevel {
    LOG,
    WARN,
    ERROR,
}

export const logStack: {
    level: logLevel;
    message: string;
}[] = [];

function showLog(level: logLevel, message: string) {
    if (level === logLevel.LOG) {
        console.log(message);
    } else if (level === logLevel.WARN) {
        console.warn(message);
    } else if (level === logLevel.ERROR) {
        console.error(message);
    }
}

function setLog(level: logLevel, message: string) {
    logStack.push({level, message});
    showLog(level, message);
}

export function log(message: string) {
    setLog(logLevel.LOG, message);
}

export function error(message: string) {
    setLog(logLevel.ERROR, message);
}

export function warn(message: string) {
    setLog(logLevel.WARN, message);
}

export function showAllLogs() {
    logStack.forEach(({level, message}) => {
        showLog(level, message);
    })
}