import * as THREE from 'three';
import { Component } from "runtime/functional/component/common";
import { renderCanvas, parseHTML } from "./base";

export enum LayerType {
    Canvas,
    HTML
};

export interface Layer<T extends HTMLElement> {
    zIndex: string
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
    zIndex: string
    type: LayerType;
    container!: HTMLCanvasElement;
    components: Component[] = [];
    width: number;
    height: number;
    renderer!: THREE.WebGLRenderer;
    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;

    constructor(size: { width: number; height: number}, zIndex: string = '0') {
        this.type = LayerType.Canvas;
        this.zIndex = zIndex;
        this.width = size.width;
        this.height = size.height;
        this.init();
    }

    init() {
        const renderer = new THREE.WebGLRenderer();

        const container = renderer.domElement;
        container.style.position = 'absolute';
        container.style.zIndex = this.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = this.width + 'px';
        container.style.height = this.height + 'px';
        this.container = container;

        // const camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 500 );
        const camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000);
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );

        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.camera = camera;

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

    /**
     * 将WebGL坐标转换为web坐标
     */
     public toWebxAxis(val: number) {
        return val - this.width / 2;
    }
    /**
     * 将WebGL坐标转换为web坐标
     */
     public toWebyAxis(val: number) {
        return -(val - this.height / 2);
    }

    render() {
        this.components.forEach(component => {
            renderCanvas(component, this.scene, this.toWebxAxis.bind(this), this.toWebyAxis.bind(this));
            // TODO 解析放入canvas中
        });
        this.renderer.render( this.scene, this.camera );
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
        this.container = document.createElement('div');
        this.init();
    }

    init() {
        const { container } = this;

        container.style.position = 'absolute';
        container.style.zIndex = this.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = this.width + 'px';
        container.style.height = this.height + 'px';
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
