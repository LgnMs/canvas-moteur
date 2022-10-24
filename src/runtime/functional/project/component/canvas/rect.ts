import { componentTag, componentType, createComponent } from "../common"
import { CanvasComponent, ICanvasComponentOptions } from "./canvasComponent";

export class Rect extends CanvasComponent {
    constructor({ name, style = { width: 0,  height: 0 }, position = { x: 0, y: 0 } }: ICanvasComponentOptions) {
        super({
            name,
            type: componentType.Rect,
            tag: componentTag.CANVAS,
        });
        this.position = position;
        this.style = style
    }

    public static new = createComponent<ICanvasComponentOptions, Rect>(Rect);
}

export const createRect = Rect.new;