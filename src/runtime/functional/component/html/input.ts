import { Component, componentTag, IComponent, IComponentOptions } from "../common"

export class Input extends Component implements IComponent {
    constructor({name, style}: IComponentOptions) {
        super({
            name,
            type: "input",
            tag: componentTag.HTML,
            style
        });
    }

    public static new(options: IComponentOptions) {
        return new Input(options);
    }
}
