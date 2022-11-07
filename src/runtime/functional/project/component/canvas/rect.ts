import { componentTag, componentType, createComponent } from "../common"
import { CanvasComponent, ICanvasComponentOptions } from "./canvasComponent";

export class Rect extends CanvasComponent {
    constructor(options: ICanvasComponentOptions) {
        super({
            ...options,
            type: componentType.Rect,
            tag: componentTag.CANVAS,
        });

        this.position = (options.position ? options.position : { x: 0, y: 0 });
        this.style = (options.style ? options.style : { width: 0,  height: 0 })
    }

    public static new = createComponent<ICanvasComponentOptions, Rect>(Rect);
}

export const createRect = Rect.new;