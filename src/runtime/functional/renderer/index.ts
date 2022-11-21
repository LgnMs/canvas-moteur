export * from './layer';

import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";
import { DargAndDrop } from 'runtime/functional/plugins/list/DargAndDrop';
import { PluginSystem } from '../plugins';

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
    constructor(options: RendererOptions) {}

    public parse(page: Page) {
        return this
    }

    /**
     * 挂载渲染器
     */
    public mount(el: HTMLElement) {
        return this;
    }

    /**
     * 卸载渲染器
     */
    public unmount() {
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
    public update() {
        return this;
    }

    /**
     * 清空界面
     */
    public clear() {
        return this;
    }
}

export function createRenderer() {
    return new Renderer({});
}
    