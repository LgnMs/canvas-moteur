import * as THREE from 'three';
import { Component } from "runtime/functional/component/common";
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
    update(component: Component): Layer<T>;

    /**
     * 渲染Layer
     */
    render(): void;
}

export class CanvasLayer implements Layer<HTMLCanvasElement> {
    zIndex: string
    type: LayerType;
    container: HTMLCanvasElement;
    components: Component[] = [];
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

    add(component: Component) {
        this.components.push(component);
        return this;
    }

    del(component: Component) {
        return this;
    }

    update(component: Component) {
        return this;
    }

    render() {
        this.renderer.parse().render();
    }
}

export class HTMLLayer implements Layer<HTMLDivElement> {
    zIndex: string;
    type: LayerType;
    container: HTMLDivElement;
    components: Component[] = [];
    width: number;
    height: number;

    constructor(size: { width: number; height: number}, zIndex: string = '1') {
        this.type = LayerType.HTML;
        this.zIndex = zIndex;
        this.width = size.width;
        this.height = size.height;
        const container = document.createElement('div');
        this.container = container;
        container.style.position = 'absolute';
        container.style.zIndex = this.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = this.width + 'px';
        container.style.height = this.height + 'px';
    }

    add(component: Component) {
        this.components.push(component);
        return this;
    }

    del(component: Component) {
        return this;
    }

    update(component: Component) {
        return this;
    }

    render() {
        this.components.forEach(component => {
            const node = parseHTML(component);

            this.container.appendChild(node);
        });
    }
}
