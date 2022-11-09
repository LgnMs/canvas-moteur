import { Project } from ".";
import { attatchScript } from "../script";
import { componentfactory } from "./component";
import { Component, componentTag, componentType } from "./component/common";
import { Page } from "./page";

export interface ComponentJson {
    [key: string]: any;
    id: string;
    name: string;
    type: componentType;
    tag: componentTag;
    components: ComponentJson[];
}

export interface PageJson {
    [key: string]: any;
    id: string;
    name: string;
    components: ComponentJson[];
}

export interface ProjectJson {
    [key: string]: any;
    id: string;
    name: string;
    version: string;
    pages: PageJson[];
}

/**
 * 加载json文件解析项目和初始化
 * @param data project json object
 */
export function loadPorject(projectData: ProjectJson) {
    const project = Project.new(projectData);

    const fn = (parent: Page | Component, componentsData: ComponentJson[]) => {
        componentsData.forEach(componentData => {
            const createComponentfn = componentfactory(componentData.tag, componentData.type);
            if (createComponentfn) {
                const com = createComponentfn(componentData);
                parent.addComponent(com);

                fn(parent, componentData.components);
            }
        })
    }

    projectData.pages.forEach(pageData => {
        const page = project.addPage(Page.new(pageData));
        fn(page, pageData.components);
    })

    attatchScript(project);

    return project;
}