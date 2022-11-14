import { generateId } from 'runtime/core/common/utils';
import { CanvasLayer, CanvasLayerOptions, HTMLLayer, HTMLLayerOptions, Layer, LayerType } from 'runtime/functional/renderer'
import { Component } from 'runtime/functional/project/component/common';

export interface ViewOptions {
    container: HTMLElement;
    layerList?: LayerOption[];
}

export interface LayerOption {
    id: string;
    zIndex: string
    type: LayerType;
    width: number;
    height: number;
    style?: Partial<CSSStyleDeclaration>;
}

/**
 * 管理渲染，例如编辑器的视图，页面、混合组件渲染
 */
export class View {
    id: string;

    activeLayerId: string = '';

    /**
     * 图层
     */
    layers: Map<string, Layer<HTMLDivElement | HTMLCanvasElement>> = new Map();

    /**
     * 容器
     */
    container: HTMLElement;

    data: Component[] = [];

    constructor(options: ViewOptions) {
        this.id = generateId({ suffix: '_view'});

        this.container = options.container;
        
        if (options.layerList) {
            this.generateLayer(options.layerList);
        } else {
            this.addHtmlLayer({
                style: {
                    backgroundColor: '#fff'
                },
                size: {
                    width: options.container.offsetWidth,
                    height: options.container.offsetHeight
                },
                zIndex: '1'
            })
        }
    }

    public addHtmlLayer(options: HTMLLayerOptions) {
        const layer = new HTMLLayer(options)
        this.layers.set(layer.id, layer);

        this.activeLayerId = layer.id;
        this.container!.appendChild(layer.el);
        return this;
    }

    public addCanvasLayer(options: CanvasLayerOptions) {
        const layer = new CanvasLayer(options)
        this.layers.set(layer.id, layer);

        this.activeLayerId = layer.id;
        this.container!.appendChild(layer.el);
        return this;
    }

    public setContainer(el: HTMLElement) {
        this.container = el;
    }

    public setActiveLayer(layerId: string) {
        this.activeLayerId = layerId;
    }

    private setData(data: Component[]) {
        this.data = data;

        data.forEach(component => {
            if (component.notRendered && component.shouldRender) {
                const layer = this.layers.get(component.layerId);
                if (layer) {
                    layer.add(component);
                }
            }
        })
    }

    generateLayer(layerList: LayerOption[]) {
        layerList.forEach(layer => {
            if (layer.type = LayerType.Canvas) {
                this.addCanvasLayer({
                    id: layer.id,
                    style: layer.style,
                    size: {
                        width: layer.width,
                        height: layer.height
                    },
                    zIndex: layer.zIndex
                })
            } else {
                this.addHtmlLayer({
                    id: layer.id,
                    style: layer.style,
                    size: {
                        width: layer.width,
                        height: layer.height
                    },
                    zIndex: layer.zIndex
                })
            }
        })
    }

    public update(data: Component[]) {

        this.setData(data);
        this.layers.forEach(layer => layer.update());
    }

    public render(data: Component[]) {

        this.setData(data);
        console.log(this)
        this.layers.forEach(layer => layer.render());
    }
}
