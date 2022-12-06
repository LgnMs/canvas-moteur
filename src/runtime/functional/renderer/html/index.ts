import { componentType } from "runtime/functional/project/component/common";
import { Canvas } from "runtime/functional/project/component/html/canvs";
import { HTMLComponent } from "runtime/functional/project/component/html/htmlComponent";
import { CanvasRenderer } from "runtime/functional/renderer/canvas";

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
    private createElement(component: HTMLComponent) {
        let el: HTMLElement | null = null;
        if (component.type === componentType.Grid) {
            el = document.createElement('div');
        } else if (component.type === componentType.Canvas) {
            const canvas = component as Canvas;
            const canvasRenderer = new CanvasRenderer({
                width: canvas.width,
                height: canvas.height,
                style: canvas.style
            })
            canvas.setRenderer(canvasRenderer);
            
            el = canvasRenderer.container;
        } else if (component.type === componentType.Vue) {
            el = document.createElement('div');
        }
        if (!el) {
            el = document.createElement(component.type);
        }
        el.setAttribute('id', component.id);

        return el;
        
    }

    public parse(component: HTMLComponent) {
        const node = this.createElement(component);
        
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