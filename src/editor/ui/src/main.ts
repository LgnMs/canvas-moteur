import { componentClass } from 'runtime/functional/component';
import { Project } from 'runtime/functional/project';
import { render } from 'runtime/functional/renderer';

const project = Project.new("测试项目1");
const page = project.addPage("测试页面1");

page.addComponent(componentClass.Input.new("测试组件1"));
page.addComponent(componentClass.Input.new("测试组件2"));
page.addComponent(componentClass.Input.new("测试组件3"));

render(page, document.querySelector<HTMLDivElement>('#app')!);


