import { Project } from "runtime/functional/project";
import { Component } from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";

export async function attatchScript(project: Project) {
    const scriptStore = window.__GLOBAL_VAR__.scriptStore

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