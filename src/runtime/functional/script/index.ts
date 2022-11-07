import { error } from "runtime/core/log";

export interface ParseScript {
    setRootPath(path: string): void;
    run: (path: string) => Promise<object>;
}

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
        // const out = await import(/* @vite-ignore */ `${this.rootPath}/${this.path}`);
        const out = await import(/* @vite-ignore */ '../../../../demo/project1/source/component1');
        return out;
    }
}

export const getParseScript = (type: string): ParseScript => {
    if (type === 'ts') {
        return ParseScriptForTs.new();
    }
    throw error(`没有找到${type}的脚本解析器`);
}