import { CanvasRenderer } from "runtime/functional/renderer/canvas";
import { componentTag, componentType, createComponent } from "../common"
import { HTMLComponent, IHTMLComponentOptions } from "./htmlComponent";

export interface ICanvasComponentOptions extends IHTMLComponentOptions {
    width?: number;
    height?: number;
}

export class Canvas extends HTMLComponent {
    width?: number;
    height?: number;
    renderer?: CanvasRenderer;

    constructor(options: ICanvasComponentOptions) {
        super({
            ...options,
            type: componentType.Canvas,
            tag: componentTag.HTML
        });

        this.width = options.width;
        this.height = options.height;
        this.renderer = options.renderer;

        this.style = {
            ...options.style
        };
    }

    setRenderer(renderer: CanvasRenderer) {
        this.renderer = renderer;
    }

    public static new = createComponent<IHTMLComponentOptions, Canvas>(Canvas);
}

export const createCanvas = Canvas.new;