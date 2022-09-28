import { Project } from "..";

test("新增项目", () => {
    const project = Project.new("测试项目1");
    const page = project.addPage("测试页面1");
    const component = page.addComponent("测试组件");
    const component2 = component.addComponent("测试组件2");
    
    const pages = project.getAllPages();
    expect(pages[0]).toEqual(page);
    expect(pages[0].getAllComponents()[0]).toEqual(component);
    expect(pages[0].getAllComponents()[0].getAllComponents()[0]).toEqual(component2);
})
