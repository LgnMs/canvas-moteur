import { error } from "runtime/core/log";

export interface ParseScript {
    setRootPath(path: string): void;
    run: (path: string) => Promise<object>;
}

/**
 * TODO: 解析脚本流程设想
 * 1. 读通过import动态读取脚本
 * 2. 如果是已经发布了的项目可以直接import
 * 3. 但是在编辑器中源文件目录与编辑器不处于同一目录所以要么起一个文件资源服务器
 */
class ParseScriptForTs implements ParseScript {
    static self?: ParseScriptForTs;

    private path?: string;
    private rootPath?: string;

    public static new() {
        if (!this.self) {
            this.self = new ParseScriptForTs();
        }
        return this.self;
    }

    setRootPath(path: string) {
        this.rootPath = path;
    }

    async run(path: string) {
        this.path = path;
        console.log(this.rootPath + '/' + this.path)
        const out = await import(/* @vite-ignore */ this.rootPath + this.path);
        // const out = await import(/* @vite-ignore */ '../../../../demo/project1/source/component1');
        return out;
    }
}

export const getParseScript = (type: string): ParseScript => {
    if (type === 'ts') {
        return ParseScriptForTs.new();
    }
    throw error(`没有找到${type}的脚本解析器`);
}