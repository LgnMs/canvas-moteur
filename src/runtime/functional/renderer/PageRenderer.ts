import { Page } from 'runtime/functional/project/page'
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';
import { componentTag } from 'runtime/functional/project/component/common';
import { HTMLComponent } from 'runtime/functional/project//component/html/htmlComponent';
import { CanvasLayer, HTMLLayer } from './layer';
import { log } from 'runtime/core/log';

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
        this.container.style.width = page.width;
        this.container.style.height = page.height;
        this.container.style.backgroundColor = '#fff';

        const { canvasLayer, htmlLayer } = this.getLayers();
        this.canvasLayer = canvasLayer;
        this.htmlLayer = htmlLayer;

        this.container.appendChild(htmlLayer.el);
        // TODO 修改渲染逻辑，页面不在默认添加canvas，canvas变为一个单独的组件，页面由组件树构成
        // this.htmlLayer.el.appendChild(canvasLayer.el);


        this.container.addEventListener('click', (e) => {
            page.dispatchEvent('click');
        })
    }

    private getLayers() {
        const size = {
            width: this.parentContainer.clientWidth,
            height: this.parentContainer.clientHeight
        }
        const canvasLayer = new CanvasLayer({ size, zIndex: '0' });
        const htmlLayer = new HTMLLayer({ size, zIndex: '1' });

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
        
        log('开始执行更新操作')
        // TODO 复现组件重复渲染的BUG并解决
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
