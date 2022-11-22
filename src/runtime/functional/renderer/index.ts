export * from './layer';

import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";
import { DargAndDrop } from 'runtime/functional/plugins/list/DargAndDrop';
import { PluginSystem } from '../plugins';
import { HTMLRenderer } from './html';
import { CanvasRenderer } from './canvas';
import { componentTag } from '../project/component/common';
import { HTMLComponent } from '../project/component/html/htmlComponent';
import { error } from 'runtime/core/log';

export function initPageRenderer(page: Page, parentContainer: HTMLElement) {
    page.onCreated();
    const pageRenderer = new PageRenderer(page, parentContainer);
    parentContainer.appendChild(pageRenderer.getContainer());
    page.onMounted();

    // TODO 完善插件加载的时机
    PluginSystem
        .init({pageRenderer})
        .install(DargAndDrop.new({ name: '拖拽插件' }))
        .run();

    return pageRenderer;
}


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
    // canvaRenderer: CanvasRenderer;

    constructor(options: RendererOptions) {
        this.htmlRenderer = new HTMLRenderer();
        // this.canvaRenderer = new CanvasRenderer();
    }

    private createRootEl(page: Page) {
        const el = document.createElement('div');
        el.style.width = page.width;
        el.style.height = page.height;
        el.style.backgroundColor = '#fff';
        
        // only-edtior
        el.style.minHeight = '100vh';
        el.style.margin = '0 auto';
        
        return el;
    }

    public parse(page: Page) {
        this.root = this.createRootEl(page);
        const components = page.getAllComponents();

        components.forEach(component => {
            if (component.tag === componentTag.HTML) {
                const node = this.htmlRenderer.parse(component as HTMLComponent);
                this.root?.appendChild(node);
            }
        })
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
        const newComponents = components.filter(component => component.notRendered === true);
        const needUpdateComponents = components.filter(component => component.shouldRender === true);

        newComponents.forEach(component => {
            if (component.tag === componentTag.HTML) {
                const node = this.htmlRenderer.parse(component as HTMLComponent);
                this.root?.appendChild(node);
            }
        })

        needUpdateComponents.forEach(component => {
            if (component.tag === componentTag.HTML) {
                // TODO 完善除了样式更新之外的属性更新
                component.setStyle(component.style);
            }
            component.setShouldRender(false);
        })

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
    