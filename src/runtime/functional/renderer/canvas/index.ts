import * as THREE from 'three';
import { CanvasLayer } from "runtime/functional/renderer/layer";
import { RectRender } from './rect'
import { componentType } from "runtime/functional/project/component/common";
import { error } from 'runtime/core/log';
import { ComponentRender } from './common';
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';

export function loadComponentRender() {
    const map = new Map<componentType, new (component: any) => ComponentRender<any>>();
    map.set(componentType.Rect, RectRender);

    return (type: componentType) => {
        if (!map.has(type)) error(`没有渲染${type}组件的实现`);

        const CanvasRenderImpl = map.get(type)!;
        return CanvasRenderImpl;
    }
}

/**
 * 二维图形渲染器
 */
export class CanvasRenderer {
    private layer: CanvasLayer;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    container: HTMLCanvasElement;
    objects: THREE.Mesh[] = [];
    componentOfObjectMap: Map<THREE.Mesh, CanvasComponent> = new Map();

    private getComponentRenderer: ReturnType<typeof loadComponentRender>;

    constructor(layer: CanvasLayer) {
        this.layer = layer;
        const renderer = new THREE.WebGLRenderer({
            // /* 开启抗锯齿 */ antialias: true
        });


        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(layer.width, layer.height);

        renderer.setClearColor(new THREE.Color('#FFFFFF'), 1);

        const container = renderer.domElement;
        container.style.position = 'absolute';
        container.style.zIndex = layer.zIndex;
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.width = layer.width + 'px';
        container.style.height = layer.height + 'px';
        this.container = container;

        // const camera = new THREE.PerspectiveCamera(45, layer.width / layer.height, 1, 1000);
        const camera = new THREE.OrthographicCamera(layer.width / - 2, layer.width / 2, layer.height / 2, layer.height / - 2, 1, 1000);
        camera.position.set( 0, 0, 1000 );
        camera.lookAt( 0, 0, 0 );

        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.camera = camera;

        this.getComponentRenderer = loadComponentRender();
    }

    public getContainer() {
        return this.container;
    }

    public getComponentByObject(object: THREE.Mesh) {
        return this.componentOfObjectMap.get(object);
    }
    /**
     * 解析组件数据
     */
    public parse() {
        this.layer.components.forEach((component, index) => {
            if (!component.shouldRender) return;

            component.onCreated();

            const componentRenderer = this.getComponentRenderer(component.type);
            const object = new componentRenderer(component)
                .toWebAxis(this.layer.width, this.layer.height)
                .parse(index);

            this.objects.push(object);
            this.scene.add(object);
            this.componentOfObjectMap.set(object, component)

            component.onMounted();

            component.setShouldRender(false);
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