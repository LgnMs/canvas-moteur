import { Component, componentTag, componentType, IComponent, IComponentOptions } from "../common"
import { ComponentStyle } from "../style";

export class Input extends Component implements IComponent {
    constructor({name, style = {}}: IComponentOptions) {
        super({
            name,
            type: componentType.Input,
            tag: componentTag.HTML
        });
        this.style = style;
    }

    public static new(options: IComponentOptions) {
        return new Input(options);
    }
}
