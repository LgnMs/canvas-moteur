import { Page } from 'runtime/functional/page'
import { componentTag } from '../component/common';
import { CanvasLayer, HTMLLayer } from './layer';

export class PageRenderer {
    /**
     * 页面
     */
    private page: Page;
    private canvasLayer: CanvasLayer;
    private htmlLayer: HTMLLayer;
    private container: HTMLDivElement;

    constructor(page: Page) {
        this.page = page;
        this.container = document.createElement('div');
        this.container.style.position = 'relative';
        this.container.style.width = page.getSize().width + 'px';
        this.container.style.height = page.getSize().height + 'px'

        const { canvasLayer, htmlLayer } = this.parse();
        this.canvasLayer = canvasLayer;
        this.htmlLayer = htmlLayer;

        this.container.appendChild(canvasLayer.container);
        this.container.appendChild(htmlLayer.container);
    }

    private parse() {
        const canvasLayer = new CanvasLayer(this.page.getSize());
        const htmlLayer = new HTMLLayer(this.page.getSize());

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
