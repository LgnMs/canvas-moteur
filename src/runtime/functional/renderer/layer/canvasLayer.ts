import { generateId } from "runtime/core/common/utils";
import { CanvasComponent } from "runtime/functional/project/component/canvas/canvasComponent";
import { CanvasRenderer } from "../canvas";
import { Layer, LayerType } from "./common";

export interface CanvasLayerOptions {
    id?: string,
    style?: Partial<CSSStyleDeclaration>;
    size: {
        width: number;
        height: number;
    };
    zIndex: string;
}

export class CanvasLayer implements Layer<HTMLCanvasElement> {
    id: string;
    zIndex: string
    type: LayerType;
    el: HTMLCanvasElement;
    components: CanvasComponent[] = [];
    width: number;
    height: number;
    renderer: CanvasRenderer;
    style?: Partial<CSSStyleDeclaration>;

    constructor(options: CanvasLayerOptions) {
        if (options.id) {
            this.id = options.id;
        } else {
            this.id = generateId({ suffix: '_layer'});
        }
        this.type = LayerType.Canvas;
        console.log(options.zIndex)
        this.zIndex = options.zIndex;
        this.width = options.size.width;
        this.height = options.size.height;

        this.renderer = new CanvasRenderer(this);
        this.el = this.renderer.getContainer();

        this.style = options.style;
        this.setStyle({...options.style})
    }

    public setStyle(style: Partial<CSSStyleDeclaration>) {
        if (this.el) {
            Object.keys(style).forEach(key => {
                Reflect.set(this.el!.style, key, Reflect.get(style, key))
            })
        }
    }

    clear() {
        this.components = [];
        this.renderer.clear();
        return this;
    }

    add(component: CanvasComponent) {
        this.components.push(component);
        return this;
    }

    del(component: CanvasComponent) {
        return this;
    }

    update() {
        this.renderer.parse().render();
    }

    render() {
        this.renderer.parse().render();
    }
}
