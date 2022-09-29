import { Component, componentTag} from "runtime/functional/component/common";
import { componentClass } from 'runtime/functional/component'
import { Page } from "runtime/functional/page";
import { Project } from "..";

describe("项目新增过程", () => {
    const project = Project.new("测试项目1");
    let pages: Page[] = [];
    let components: Component[] = [];
    let componentChilds: Component[] = [];

    test("添加页面", () => {
        const page = project.addPage("测试页面1");
        pages = project.getAllPages();
        expect(pages[0]).toEqual(page);
    })

    test("向页面添加组件", () => {
        const component = pages[0].addComponent(componentClass.Rect.new({name: "测试组件"}));
        components = pages[0].getAllComponents();  
        expect(components[0]).toEqual(component);
    })

    test("向组件添加组件", () => {
        const componentChild = components[0].addComponent(componentClass.Rect.new({name: "测试组件的子组件"}));
        componentChilds = components[0].getAllComponents();  
        expect(componentChilds[0]).toEqual(componentChild);
    })

})
