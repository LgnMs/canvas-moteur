export interface Script {
    [key: string]: any;

    onMounted?(): void;

    onUnMounted?(): void;
}


export type ScriptFn = () => Script;

export interface IScriptStore {
    [key: string]: ScriptFn;
}

export function defineScript(fn: ScriptFn, componentId: string) {
    window.__GLOBAL_VAR__.scriptStore[componentId] = fn;
}
