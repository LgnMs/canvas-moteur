export type ScriptData = { [key: string]: any };
export type  ScriptLifeCycle = () => void;
export type  ScriptMethod = { [key: string]: Function };
export interface Script {
    data?: ScriptData;
    onCreated?: ScriptLifeCycle;
    onMounted?: ScriptLifeCycle;
    onUpdate?: ScriptLifeCycle;
    onUnmounted?: ScriptLifeCycle;
    methods?: ScriptMethod;
}

export class Script {
    /**
     * 解析脚本
     */
    public static parse(text: string) {

    }
}
