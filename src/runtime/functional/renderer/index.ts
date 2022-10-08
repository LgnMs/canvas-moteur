import { Page } from 'runtime/functional/project/page';
import { PageRenderer } from "./pageRenderer";

export function render(page: Page, parentContainer: HTMLElement){
    const pageRenderer = new PageRenderer(page, parentContainer);

    parentContainer.appendChild(pageRenderer.getContainer());
    
    pageRenderer.render();
}
