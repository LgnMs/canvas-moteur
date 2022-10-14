import { componentClass } from 'runtime/functional/project/component';
import { Page } from 'runtime/functional/project/page';
import { Project } from 'runtime/functional/project';
import { render } from 'runtime/functional/renderer';
import page1Script from './page1Script';


export function renderHtml(container: HTMLDivElement) {
    const project = Project.new("测试项目1");
    const page = project.addPage(Page.new({ name: '测试页面1'}));

    // 添加脚本
    page.setup = page1Script

    const com1 = componentClass.Input.new({name: "测试组件1"});
    page.addComponent(com1);

    com1.setup = () => {
        return {
            onCreated: () => {
                console.log('com1 created')
            },
            onMounted: () => {
                console.log('com1 onMounted')
            },
        }
    }

    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    page.addComponent(componentClass.Input.new({name: "测试组件1"}));
    const com2 = componentClass.Rect.new({
        name: "测试组件4",
        position: {
            x: 0,
            y: 0
        },
        style: {
            height: 100,
            width: 100,
            backgroundColor: 'yellowGreen',
        }
    })
    page.addComponent(com2);


    com2.setup = () => {
        return {
            onCreated: () => {
                console.log('com2 created')
            },
            onMounted: () => {
                console.log('com2 onMounted')
            },
        }
    }

    page.addComponent(componentClass.Rect.new({
        name: "测试组件5",
        position: {
            x: 0,
            y: 0
        },
        style: {
            height: 100,
            width: 100,
            backgroundColor: 'blue',
        }
    }));

    page.addComponent(componentClass.Rect.new({
        name: "测试组件6",
        position: {
            x: 100,
            y: 100
        },
        style: {
            height: 100,
            width: 100,
            backgroundColor: 'red',
        }
    }));
    render(page, container);
    
}
