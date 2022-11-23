import { componentType } from "runtime/functional/project/component/common";
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

    node.addEventListener('click', (e) => {
        component.dispatchEvent('click', e);
    })
    return node;
}

export class HTMLRenderer {
    private createElement(type: componentType) {
        let elType = '';
        if (type === componentType.Grid) {
            elType = 'div';
        } else {
            elType = type;
        }
        return document.createElement(elType);
    }

    public parse(component: HTMLComponent) {
        const node = this.createElement(component.type);
        
        Object.keys(component.style).forEach(key => {
            Reflect.set(node.style, key, Reflect.get(component.style, key))
        })

        component.setShouldRender(false);
        component.setNotRendered(false);
        component.setEl(node);
        node.addEventListener('click', (e) => {
            component.dispatchEvent('click', e);
        })
        
        return node;
    }
}