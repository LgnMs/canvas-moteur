import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";
import { DargAndDrop } from 'runtime/functional/plugins/list/DargAndDrop';
import { PluginSystem } from '../plugins';

// /**
//  * 渲染页面
//  * @param page 当前的页面数据
//  * @param parentContainer 渲染元素的容器
//  * @returns 当前页面的渲染器 
//  */
// export function render(page: Page, parentContainer: HTMLElement) {
//     page.onCreated();
//     const pageRenderer = new PageRenderer(page, parentContainer);
//     parentContainer.appendChild(pageRenderer.getContainer());

//     page.onMounted();
    
//     pageRenderer.render();
 
//     // TODO 完善插件加载的时机
//     PluginSystem
//         .init({pageRenderer})
//         .install(DargAndDrop.new({ name: '拖拽插件' }))
//         .run();

//     return pageRenderer;
// }

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

