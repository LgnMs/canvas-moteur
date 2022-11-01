import { Component } from "runtime/functional/project/component/common";
import { HTMLComponent } from "runtime/functional/project/component/html/htmlComponent";
import { CanvasComponent } from "runtime/functional/project/component/canvas/canvasComponent";
import { CanvasRenderer } from './canvas';
import { parseHTML } from './html';

export enum LayerType {
    Canvas,
    HTML
};

export interface Layer<T extends HTMLElement> {
    zIndex: string
    type: LayerType;
    container: T;
    components: Component[];
    width: number;
    height: number;

    clear(): Layer<T>;
    /**
     * 向Layer中添加元素
     */
    add(component: Component): Layer<T>;

    /**
     * 删除Layer中添加元素
     */
    del(component: Component): Layer<T>;

    /**
     * 更新Layer中添加元素
     */
    update(component: Component): void;

    /**
     * 渲染Layer
     */
    render(): void;
}

export class CanvasLayer implements Layer<HTMLCanvasElement> {
    zIndex: string
    type: LayerType;
    container: HTMLCanvasElement;
    components: CanvasComponent[] = [];
    width: number;
    height: number;
    renderer: CanvasRenderer;

    constructor(size: { width: number; height: number}, zIndex: string = '0') {
        this.type = LayerType.Canvas;
        this.zIndex = zIndex;
        this.width = size.width;
        this.height = size.height;

        this.renderer = new CanvasRenderer(this);
        this.container = this.renderer.getContainer();
    }

    clear() {
        this.components = [];
        this.renderer.clear();
        return this;
    }

    add(component: CanvasComponent) {
        this.components.push(component);
        return this;
    }

    del(component: CanvasComponent) {
        return this;
    }

    update() {
        this.renderer.parse().render();
    }

    render() {
        this.renderer.parse().render();
    }
}

export class HTMLLayer implements Layer<HTMLDivElement> {
    zIndex: string;
    type: LayerType;
    container: HTMLDivElement;
    components: HTMLComponent[] = [];
    width: number;
    height: number;

    constructor(size: { width: number; height: number}, zIndex: string = '1') {
        this.type = LayerType.HTML;
        this.zIndex = zIndex;
        this.width = size.width;
        this.height = size.height;
        const container = document.createElement('div');
        this.container = container;
        container.style.position = 'relative';
        container.style.zIndex = this.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = this.width + 'px';
        container.style.height = this.height + 'px';
    }

    clear() {
        this.components = [];
        this.container.innerHTML = '';
        return this;
    }

    add(component: HTMLComponent) {
        this.components.push(component);
        return this;
    }

    del(component: HTMLComponent) {
        return this;
    }

    update() {
        const diffComponents: HTMLComponent[] = [];

        this.components.forEach(item => {
            if (item.shouldRender) {
                diffComponents.push(item)
            }
        })

        diffComponents.forEach(component => {
            if (component.notRendered) {
                const node = parseHTML(component);
    
                component.onCreated();
                this.container.appendChild(node);
                component.onMounted();
            } else {
                component.setStyle(component.style);
            }
        });
    }

    render() {
        this.components.forEach(component => {
            const node = parseHTML(component);

            component.onCreated();

            this.container.appendChild(node);
            component.onMounted();
        });
    }

}
