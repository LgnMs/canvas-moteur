import { Page } from 'runtime/functional/project/page'
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';
import { componentTag } from 'runtime/functional/project/component/common';
import { HTMLComponent } from 'runtime/functional/project//component/html/htmlComponent';
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

        const { canvasLayer, htmlLayer } = this.getLayers();
        this.canvasLayer = canvasLayer;
        this.htmlLayer = htmlLayer;

        this.container.appendChild(htmlLayer.container);
        this.htmlLayer.container.appendChild(canvasLayer.container);
    }

    private getLayers() {
        const size = {
            width: this.parentContainer.clientWidth,
            height: this.parentContainer.clientHeight
        }
        const canvasLayer = new CanvasLayer(size);
        const htmlLayer = new HTMLLayer(size);

        const components = this.page.getAllComponents();

        components.forEach((component) => {
            if (component.tag === componentTag.CANVAS) {
                canvasLayer.add(component as CanvasComponent);
            } else {
                htmlLayer.add(component as HTMLComponent);
            }
        })

        return { canvasLayer, htmlLayer };
    }

    public getContainer() {
        return this.container;
    }

    public getCanvasLayer() {
        return this.canvasLayer;
    }

    public getHtmlLayer() {
        return this.htmlLayer;
    }

    public render() {
        this.canvasLayer.render();
        this.htmlLayer.render();
    }

    public update(page: Page) {
        this.page = page;
        const components = this.page.getAllComponents();

        components.forEach((component) => {
            if (component.notRendered && component.shouldRender) {
                if (component.tag === componentTag.CANVAS) {
                    this.canvasLayer.add(component as CanvasComponent);
                } else {
                    this.htmlLayer.add(component as HTMLComponent);
                }
            }

        })
        
        this.canvasLayer.update();
        this.htmlLayer.update();
        
    }

    public clear() {
        this.canvasLayer.clear();
        this.htmlLayer.clear();
    }
}
