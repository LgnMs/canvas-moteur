import * as THREE from 'three';
import { CanvasLayer } from "runtime/functional/renderer/layer";
import { RectRender } from './rect'
import { componentType } from "runtime/functional/component/common";
import { error } from 'runtime/core/log';
import { ComponentRender } from './common';

export function loadComponentRender() {
    const map = new Map<componentType, new (component: any) => ComponentRender<any>>();
    map.set(componentType.Rect, RectRender);

    return (type: componentType) => {
        if (!map.has(type)) error(`没有渲染${type}组件的实现`);

        const CanvasRenderImpl = map.get(type)!;
        return CanvasRenderImpl;
    }
}

export class CanvasRenderer {
    private layer: CanvasLayer;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private container: HTMLCanvasElement;
    private getComponentRenderer: ReturnType<typeof loadComponentRender>;

    constructor(layer: CanvasLayer) {
        this.layer = layer;
        const renderer = new THREE.WebGLRenderer();
        const container = renderer.domElement;
        container.style.position = 'absolute';
        container.style.zIndex = layer.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = layer.width + 'px';
        container.style.height = layer.height + 'px';
        this.container = container;

        const camera = new THREE.OrthographicCamera(layer.width / - 2, layer.width / 2, layer.height / 2, layer.height / - 2, 1, 1000);
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );

        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.camera = camera;

        this.getComponentRenderer = loadComponentRender();
    }

    public getContainer() {
        return this.container;
    }
    /**
     * 解析组件数据
     */
    public parse() {
        this.layer.components.forEach(component => {
            const componentRenderer = this.getComponentRenderer(component.type);
            const value = new componentRenderer(component).parse();
            this.scene.add(value);
        })
        return this;
    }

    /**
     * 渲染组件
     */
    public render() {
        this.renderer.render(this.scene, this.camera);
        return this;
    }
}