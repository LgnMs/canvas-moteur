import { componentClass } from 'runtime/functional/project/component';
import { Page } from 'runtime/functional/project/page';
import { Project } from 'runtime/functional/project';
import { render } from 'runtime/functional/renderer';
import { PluginSystem } from 'runtime/functional/plugins';
import { DargAndDrop } from 'runtime/functional/plugins/list/DargAndDrop';


export function renderHtml(container: HTMLDivElement) {
    const project = Project.new("测试项目1");
    const page = project.addPage(Page.new({ name: '测试页面1'}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Rect.new({
        name: "测试组件4",
        style: {
            height: 150,
            width: 250,
            backgroundColor: 'yellowGreen',
        }
    }));
    page.addComponent(componentClass.Rect.new({
        name: "测试组件5",
        position: {
            x: 50,
            y: 100
        },
        style: {
            height: 150,
            width: 250,
            backgroundColor: 'blue',
        }
    }));
    
    const renderer = render(page, container);
    

    PluginSystem
        .init({pageRenderer: renderer})
        .install(DargAndDrop.new({ name: '拖拽插件' }))
        .run();
}
