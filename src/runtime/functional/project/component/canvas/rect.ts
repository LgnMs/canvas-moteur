import { componentTag, componentType, IComponentOptions } from "../common"
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

    public static new(options: ICanvasComponentOptions) {
        const target = new Rect(options);

        return new Proxy(target, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver)
            }
        });
    }
}
