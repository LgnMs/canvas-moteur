import { componentClass } from 'runtime/functional/component';
import { Project } from 'runtime/functional/project';
import { render } from 'runtime/functional/renderer';


export function renderHtml(container: HTMLDivElement) {
    const project = Project.new("测试项目1");
    const page = project.addPage("测试页面1");
    
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Rect.new({
        name: "测试组件4",
        style: {
            x: 20,
            y: 80,
            height: 150,
            width: 250,
            backgroundColor: 'yellowGreen',
        }
    }));

    render(page, container);
}
