export * from './layer';

import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";
import { DargAndDrop } from 'runtime/functional/plugins/list/DargAndDrop';
import { PluginSystem } from '../plugins';

// export function initPageRenderer(page: Page, parentContainer: HTMLElement) {
//     page.onCreated();
//     const pageRenderer = new PageRenderer(page, parentContainer);
//     parentContainer.appendChild(pageRenderer.getContainer());
//     page.onMounted();

//     // TODO 完善插件加载的时机
//     PluginSystem
//         .init({pageRenderer})
//         .install(DargAndDrop.new({ name: '拖拽插件' }))
//         .run();

//     return pageRenderer;
// }
