export * from './component1'
export * from './page1Script'

console.log(12312);

(window as any).script = {
    a: 1
}

console.log(window.script);