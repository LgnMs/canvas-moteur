import { Component, componentTag, IComponent, IComponentOptions } from "../common"
import { ComponentStyle } from "../style";

export class Rect extends Component implements IComponent {
    style: ComponentStyle;

    constructor({name, style}: IComponentOptions) {
        super({
            name,
            type: "rect",
            tag: componentTag.CANVAS,
            style
        });
        if (style) {
            this.style = style
        } else {
            this.style = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    }

    public static new(options: IComponentOptions) {
        return new Rect(options);
    }
}
