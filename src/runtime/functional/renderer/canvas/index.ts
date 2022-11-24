import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';
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

export interface CanvasRendererOptions {
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
}
/**
 * 二维图形渲染器
 */
export class CanvasRenderer {
    /**
     * 基于Raycaster实现的事件管理器
     * https://threejs.org/docs/index.html#api/en/core/Raycaster
     * https://github.com/markuslerner/THREE.Interactive
     */
    interactionManager: InteractionManager;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    container: HTMLCanvasElement;
    objects: THREE.Mesh[] = [];
    componentOfObjectMap: Map<THREE.Mesh, CanvasComponent> = new Map();

    private getComponentRenderer: ReturnType<typeof loadComponentRender>;

    constructor(options: CanvasRendererOptions) {
        const renderer = new THREE.WebGLRenderer({
            // /* 开启抗锯齿 */ antialias: true
        });

        if (!options.width) {
            options.width = 300;
        }
        if (!options.height) {
            options.height = 150;
        }

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(options.width, options.height);

        renderer.setClearColor(new THREE.Color('#FFFFFF'), 1);

        const container = renderer.domElement;

        if (options.style) {
            Object.keys(options.style).forEach(key => {
                Reflect.set(container.style, key, Reflect.get(container.style, key))
            })
        }

        this.container = container;

        // const camera = new THREE.PerspectiveCamera(45, layer.width / layer.height, 1, 1000);
        const camera = new THREE.OrthographicCamera(options.width / - 2, options.width / 2, options.height / 2, options.height / - 2, 1, 1000);
        camera.position.set( 0, 0, 1000 );
        camera.lookAt( 0, 0, 0 );

        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.camera = camera;

        this.interactionManager = new InteractionManager(
            renderer,
            camera,
            renderer.domElement,
            false
        );
        this.getComponentRenderer = loadComponentRender();
    }

    public getContainer() {
        return this.container;
    }

    public getComponentByObject(object: THREE.Mesh) {
        return this.componentOfObjectMap.get(object);
    }

    public attachEvent(object: THREE.Mesh, component: CanvasComponent) {

        object.addEventListener('click', (e) => {
            component.dispatchEvent('click', e);
        })


        this.interactionManager.add(object);
    }


    /**
     * 清空渲染器以及释放相关内存
     */
    public clear() {
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
    }

    // /**
    //  * 解析组件数据
    //  */
    // public parse_old() {
    //     this.layer.components.forEach((component, index) => {
    //         if (!component.shouldRender) return;

    //         if (component.notRendered) {
    //             component.onCreated();
    
    //             const componentRenderer = this.getComponentRenderer(component.type);
    //             const object = new componentRenderer(component)
    //                 .parse(index);
    
    //             component.mesh = object;
                    
    //             this.objects.push(object);
    //             this.scene.add(object);
    //             this.componentOfObjectMap.set(object, component)
    
    //             component.onMounted();
    
    //             this.attachEvent(object, component);

    //             component.setNotRendered(false);
    //         } else {
    //             const componentRenderer = this.getComponentRenderer(component.type);
    //             new componentRenderer(component)
    //                 .update();
                
    //         }
    //         component.setShouldRender(false);
    //     })
    //     return this;
    // }

    public parse(component: CanvasComponent) {
        const componentRenderer = this.getComponentRenderer(component.type);
        const object = new componentRenderer(component).parse(this.objects.length);

        component.mesh = object;

        this.objects.push(object);
        this.componentOfObjectMap.set(object, component)
        this.attachEvent(object, component);

        component.setNotRendered(false);
        component.setShouldRender(false);

        return object;
    }

    public add(object: THREE.Mesh) {
        this.scene.add(object);
    }

    public update(component: CanvasComponent) {
        const componentRenderer = this.getComponentRenderer(component.type);
        new componentRenderer(component)
            .update();
        component.setShouldRender(false);
    }
    /**
     * 渲染组件
     */
    public render() {
        this.interactionManager.update();
        this.renderer.render(this.scene, this.camera);

        return this;
    }
}