import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { join } from '@tauri-apps/api/path';
import { Project } from "runtime/functional/project";
import { componentfactory } from "runtime/functional/project/component";
import { componentTag, componentType } from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";

export interface ProjectJson {
    [key: string]: any;
    id: string;
    name: string;
    pages: {
        [key: string]: any;
        id: string;
        name: string;
        components: {
            [key: string]: any;
            id: string;
            name: string;
            type: componentType;
            tag: componentTag;
        }[]
    }[]
}

async function readFile(path: string) {
    const content = await readTextFile(path, { dir: BaseDirectory.Home })
    console.log(content)
    const fn = new Function(content);
    console.log(fn);
    console.log(fn());
}

export async function loadPorject(data: ProjectJson, rootPath: string) {

    const project = Project.new(data.name);

    const loadScript = function*(list: any[]) {
        for (let i = 0; i < list.length; i++) {
            const path = rootPath + list[i].scriptPath;
            if (list[i].scriptPath) {
                // yield import(/* @vite-ignore */ path);
                yield import(/* @vite-ignore */ path);
            } else {
                yield new Promise((resolve, reject) => resolve(null));
            }
        }
    }

    let pageIndex = 0;
    readFile(await join(rootPath, 'source', 'page1Script.ts'))
    for (const pageScript of loadScript(data.pages)) {
        const res = await pageScript;
        const page = project.addPage(Page.new({ name: data.pages[pageIndex].name }));
        page.setup = res.default;

        let comIndex = 0;
        for (const componentScript of loadScript(data.pages[pageIndex].components)) {
            const res2 = await componentScript;

            const item2 = data.pages[pageIndex].components[comIndex];
            const createComponentfn = componentfactory(item2.tag, item2.type);
            
            if (createComponentfn) {
                const com = createComponentfn(item2);
                if (res2) {
                    com.setup = res2.default;
                }
                page.addComponent(com)
                comIndex += 1;
            }
        }
        pageIndex += 1;
    }
    return project;
}