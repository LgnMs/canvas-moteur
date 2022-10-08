import { Page } from 'runtime/functional/project/page'
import { componentTag } from '../project/component/common';
import { CanvasLayer, HTMLLayer } from './layer';

export class PageRenderer {
    /**
     * 页面
     */
    private page: Page;
    private canvasLayer: CanvasLayer;
    private htmlLayer: HTMLLayer;
    private container: HTMLDivElement;

    private parentContainer: HTMLElement;

    constructor(page: Page, parentContainer: HTMLElement) {
        this.parentContainer = parentContainer;
        this.page = page;
        this.container = document.createElement('div');
        this.container.style.position = 'relative';
        this.container.style.width = parentContainer.clientWidth + 'px';
        this.container.style.height = parentContainer.clientHeight + 'px'

        const { canvasLayer, htmlLayer } = this.parse();
        this.canvasLayer = canvasLayer;
        this.htmlLayer = htmlLayer;

        this.container.appendChild(canvasLayer.container);
        this.container.appendChild(htmlLayer.container);
    }

    private parse() {
        const size = {
            width: this.parentContainer.clientWidth,
            height: this.parentContainer.clientHeight
        }
        const canvasLayer = new CanvasLayer(size);
        const htmlLayer = new HTMLLayer(size);

        const components = this.page.getAllComponents();

        components.forEach((component) => {
            if (component.tag === componentTag.CANVAS) {
                canvasLayer.add(component);
            } else {
                htmlLayer.add(component);
            }
        })

        return { canvasLayer, htmlLayer };
    }

    public getContainer() {
        return this.container;
    }

    public render() {
        this.canvasLayer.render();
        this.htmlLayer.render();
    }
}
