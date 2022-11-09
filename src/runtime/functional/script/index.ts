import { error } from "runtime/core/log";
import { Project } from "runtime/functional/project";
import { Component } from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";

export interface ParseScript {
    run: (id: string) => Promise<object>;
}

class ParseScriptForTs implements ParseScript {
    static self?: ParseScriptForTs;

    public static new() {
        if (!this.self) {
            this.self = new ParseScriptForTs();
        }
        return this.self;
    }

    async run(id: string) {
        if (window.__CV__.scriptStore[id]) {
            const fn = window.__CV__.scriptStore[id];
            return fn();
        }
    }
}

export const getParseScript = (type: string): ParseScript => {
    if (type === 'ts') {
        return ParseScriptForTs.new();
    }
    throw error(`没有找到${type}的脚本解析器`);
}

export async function attatchScript(project: Project) {
    const scriptStore = window.__CV__.scriptStore

    console.log(scriptStore)
    const attch = (p: Project | Page | Component) => {
        if (scriptStore[p.id]) {
            const fn = scriptStore[p.id];
            const obj = fn();
            Object.keys(obj).forEach(key => Reflect.set(p, key, Reflect.get(obj, key)));
        }
    }
    attch(project);

    const fn2 = (list: Component[]) => {
        if (list.length > 0) {
            list.forEach(item => {
                attch(item);
                
                fn2(item.components);
            })
        }
    }

    project.pages.forEach(page => {
        attch(page);

        fn2(page.components);
    })
}