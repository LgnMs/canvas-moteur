export interface Script {
    [key: string]: any;

    onMounted?(): void;

    onUnMounted?(): void;
}


export type ScriptFn = () => Script;

export interface IScriptStore {
    [key: string]: ScriptFn;
}

window.__CV__ = {
    scriptStore: {}
}
export function defineScript(fn: ScriptFn, componentId: string) {
    window.__CV__.scriptStore[componentId] = fn;
}
