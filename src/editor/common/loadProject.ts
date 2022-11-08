import { Project } from "runtime/functional/project";
import { componentfactory } from "runtime/functional/project/component";
import { componentTag, componentType } from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";
import { getParseScript } from "runtime/functional/script";

export interface ProjectJson {
    [key: string]: any;
    id: string;
    name: string;
    pages: {
        [key: string]: any;
        id: string;
        name: string;
        script: {
            type: string;
            path: string;
        };
        components: {
            [key: string]: any;
            id: string;
            name: string;
            type: componentType;
            tag: componentTag;
            script: {
                type: string;
                path: string;
            }
        }[]
    }[]
}

export async function loadPorject(data: ProjectJson, rootPath: string) {
    getParseScript('ts').setRootPath('../../../../demo/project1');

    const project = Project.new(data.name);

    const loadScript = function*(list: any[]) {
        for (let i = 0; i < list.length; i++) {
            // if (list[i].scriptPath) {
            //     yield import(/* @vite-ignore */ `${rootPath}/${list[i].scriptPath}`);
            // } else {
                yield new Promise<{default: Function}>((resolve, reject) => resolve({default: () => {}}));
            // }
        }
    }

    let pageIndex = 0;
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