import { Page } from 'runtime/functional/project/page';
import { render } from 'runtime/functional/renderer';

export function renderPage(container: HTMLDivElement, page: Page){
    render(page, container);
}
