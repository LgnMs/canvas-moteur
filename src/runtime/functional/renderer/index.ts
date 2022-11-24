import { Page } from 'runtime/functional/project/page';
import { HTMLRenderer } from './html';
import { Component, componentTag } from 'runtime/functional/project/component/common';
import { HTMLComponent } from 'runtime/functional/project/component/html/htmlComponent';
import { error } from 'runtime/core/log';
import { Canvas } from 'runtime/functional/project/component/html/canvs';
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';
import { toRaw } from 'vue';

export interface RendererOptions {

}

/**
 * 渲染器，负责对组件树的解析更新和展示操作
 */
export class Renderer {
    /**
     * 组件树的根节点
     */
    root: HTMLDivElement | null = null;
    mountEl: HTMLElement | null = null;
    htmlRenderer: HTMLRenderer;

    constructor(options: RendererOptions) {
        this.htmlRenderer = new HTMLRenderer();
    }

    private createRootEl(page: Page) {
        const el = document.createElement('div');
        el.style.width = page.width;
        el.style.height = page.height;

        // 布局系统实现 基于grid
        // el.style.display = 'grid';
        // el.style.gridTemplateColumns = '1fr 1fr 1fr';
        // el.style.gridAutoRows = '200px auto 100px';
        // el.style.gridTemplateAreas = `
        //     "cell1 cell1 cell1"
        //     "cell2 cell2 cell3"
        //     "cell2 cell2 cell3"
        // `;
        
        // only-edtior
        el.style.minHeight = '100vh';
        el.style.margin = '0 auto';

        Object.keys(page.style).forEach(key => {
            Reflect.set(el.style, key, Reflect.get(page.style, key))
        })

        el.addEventListener('click', (e) => {
            page.dispatchEvent('click', e);
        })
        
        return el;
    }

    public parse(page: Page) {
        this.root = this.createRootEl(page);
        const components = page.getAllComponents();

        const fn = (components: Component[], parent: HTMLElement) => {
            components.forEach(component => {
                if (component.tag === componentTag.HTML) {
                    const node = this.htmlRenderer.parse(component as HTMLComponent);
                    parent.appendChild(node);

                    if (component.components.length > 0) {
                        fn (component.components, node);
                    }
                }
            })
        }

        fn(components, this.root);
        return this
    }

    /**
     * 挂载渲染器
     */
    public mount(el: HTMLElement) {
        this.mountEl = el;
        if (this.root) {
            el.appendChild(this.root);
        } else {
            error('没有创建root节点');
        }
        return this;
    }

    /**
     * 卸载渲染器
     */
    public unmount() {
        if (this.root) {
            this.mountEl?.removeChild(this.root);
            this.mountEl = null;
        }
        return this;
    }

    /**
     * 安装插件
     */
    public installPlugins() {
        return this;
    }

    /**
     * 更新界面
     */
    public update(page: Page) {
        const components = page.getAllComponents();

        const fn = (components: Component[], parent: HTMLElement | null, parentComponent?: Component) => {
            components.forEach(component => {
                let node: HTMLElement | null = null;
                if (component.notRendered) {
                    if (component.tag === componentTag.HTML) {
                        node = this.htmlRenderer.parse(component as HTMLComponent);
                        parent?.appendChild(node);
                    } else if (component.tag === componentTag.CANVAS) {
                        // const canvas = toRaw(parentComponent) as Canvas;
                        const canvas = parentComponent as Canvas;
                        const object = canvas.renderer!.parse(component as CanvasComponent);
                        console.log(canvas)
                        canvas.renderer!.add(object);
                        canvas.renderer!.render();
                    }
                }
                if (component.shouldRender) {
                    if (component.tag === componentTag.HTML) {
                        // TODO 完善除了样式更新之外的属性更新
                        component.setStyle(component.style);

                        node = (component as HTMLComponent).el!;
                    } else if (component.tag === componentTag.CANVAS) {
                        const canvas = parentComponent as Canvas;
                        canvas.renderer!.update(component as CanvasComponent);
                        canvas.renderer!.render();
                    }
                    component.setShouldRender(false);
                }

                if (component.components.length > 0) {
                    fn(component.components, node, component);
                }
            })
        }

        this.root && fn(components, this.root);

        return this;
    }

    /**
     * 清空界面
     */
    public clear() {
        this.unmount();
        this.root = null;
        return this;
    }
}

export function createRenderer() {
    return new Renderer({});
}
    