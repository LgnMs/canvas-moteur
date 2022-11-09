import { IScriptStore } from "./runtime/functional/script/defineScript";

declare global {
    interface Window {
        __CV__: {
            scriptStore: IScriptStore;
        }
    }
}

export {};