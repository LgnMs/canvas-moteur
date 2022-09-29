import { Page } from 'runtime/functional/page';
import { PageRenderer } from "./PageRenderer";

export function render(page: Page, parentContainer: HTMLElement){
    const pageRenderer = new PageRenderer(page);

    parentContainer.appendChild(pageRenderer.getContainer());
    
    pageRenderer.render();
}