export function isDesktop() {
    console.log(import.meta.env.VITE_RUN_ENV)
    return import.meta.env.VITE_RUN_ENV === 'desktop'
}

export function isWeb() {
    return import.meta.env.VITE_RUN_ENV === 'web'
}
