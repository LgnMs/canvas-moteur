import { IScriptStore } from "runtime/functional/script/defineScript";

declare global {
    interface Window {
        __GLOBAL_VAR__: {
            scriptStore: IScriptStore;
        }
    }
}

export {};
