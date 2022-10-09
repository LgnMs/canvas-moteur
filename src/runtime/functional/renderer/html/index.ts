import { HTMLComponent } from "runtime/functional/project/component/html/htmlComponent";

export function parseHTML(component: HTMLComponent) {
    const node = document.createElement(component.type);
    // TODO 添加属性、样式

    Object.keys(component.style).forEach(key => {
        Reflect.set(node.style, key, Reflect.get(component.style, key))
    })
    console.log(component.style, node.style)

    return node;
}