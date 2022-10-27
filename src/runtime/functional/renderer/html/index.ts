import { HTMLComponent } from "runtime/functional/project/component/html/htmlComponent";

export function parseHTML(component: HTMLComponent) {
    const node = document.createElement(component.type);
    // TODO 添加属性、样式

    Object.keys(component.style).forEach(key => {
        Reflect.set(node.style, key, Reflect.get(component.style, key))
    })

    // 组件已经被解析过了，就重新设置渲染状态
    component.setShouldRender(false);
    component.setNotRendered(false);
    component.setEl(node);

    node.addEventListener('click', () => {
        component.dispatchEvent('click');
    })
    return node;
}