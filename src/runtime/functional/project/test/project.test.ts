import { Component} from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";
import { Project } from "..";
import { createRect } from "../component/canvas/rect";

describe("项目新增过程", () => {
    const project = Project.new({ name: "测试项目1"});
    let pages: Page[] = [];
    let components: Component[] = [];
    let componentChilds: Component[] = [];

    test("添加页面", () => {
        const page = Page.new({name: "测试页面1"});
        project.addPage(page);
        pages = project.getAllPages();
        expect(pages[0]).toEqual(page);
        const component = pages[0].addComponent(createRect({name: "测试组件"}));
        components = pages[0].getAllComponents();  
        expect(components[0]).toEqual(component);
        const componentChild = components[0].addComponent(createRect({name: "测试组件的子组件"}));
        componentChilds = components[0].getAllComponents();  
        expect(componentChilds[0]).toEqual(componentChild);
    })


})
