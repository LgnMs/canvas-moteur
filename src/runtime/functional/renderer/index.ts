import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";

/**
 * 渲染页面
 * @param page 当前的页面数据
 * @param parentContainer 渲染元素的容器
 * @returns 当前页面的渲染器 
 */
export function render(page: Page, parentContainer: HTMLElement) {
    const pageRenderer = new PageRenderer(page, parentContainer);

    parentContainer.appendChild(pageRenderer.getContainer());
    
    pageRenderer.render();

    return pageRenderer;
}
