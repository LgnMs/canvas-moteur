import { componentClass } from 'runtime/functional/project/component';
import { Page } from 'runtime/functional/project/page';
import { Project } from 'runtime/functional/project';
import { render } from 'runtime/functional/renderer';


export function renderHtml(container: HTMLDivElement) {
    const project = Project.new("测试项目1");
    const page = project.addPage(Page.new({ name: '测试页面1'}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Rect.new({
        name: "测试组件4",
        position: {
            x: 0,
            y: 0
        },
        style: {
            height: 200,
            width: 200,
            backgroundColor: 'yellowGreen',
        }
    }));
    // page.addComponent(componentClass.Rect.new({
    //     name: "测试组件5",
    //     position: {
    //         x: 0,
    //         y: 0
    //     },
    //     style: {
    //         height: 200,
    //         width: 200,
    //         backgroundColor: 'blue',
    //     }
    // }));

    // page.addComponent(componentClass.Rect.new({
    //     name: "测试组件6",
    //     position: {
    //         x: 100,
    //         y: 100
    //     },
    //     style: {
    //         height: 250,
    //         width: 250,
    //         backgroundColor: 'red',
    //     }
    // }));
    render(page, container);
    
}
