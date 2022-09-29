import { Component } from "runtime/functional/component/common";
import { parseCanvas, parseHTML } from "./base";

export enum LayerType {
    Canvas,
    HTML
};

export interface Layer<T extends HTMLElement> {
    zIndex: number;
    type: LayerType;
    container: T;
    components: Component[];

    /**
     * 初始化Layer
     */
    init(): Layer<T>;

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
    zIndex: number;
    type: LayerType;
    container: HTMLCanvasElement;
    components: Component[] = [];

    constructor(zIndex: number = 0) {
        this.type = LayerType.Canvas;
        this.zIndex = zIndex;
        this.container = document.createElement('canvas');
    }

    init() {
        return this;
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
            const node = parseCanvas(component);
            // TODO 解析放入canvas中
        });
    }
}

export class HTMLLayer implements Layer<HTMLDivElement> {
    zIndex: number;
    type: LayerType;
    container: HTMLDivElement;
    components: Component[] = [];

    constructor(zIndex: number = 0) {
        this.type = LayerType.HTML;
        this.zIndex = zIndex;
        this.container = document.createElement('div');
    }

    init() {
        return this;
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
