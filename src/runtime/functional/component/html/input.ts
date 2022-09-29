import { Component, componentTag, IComponent } from "../common"

export class Input extends Component implements IComponent {
    constructor(name: string) {
        super(name, 'Input', componentTag.HTML);
    }

    public static new(name: string) {
        return new Input(name);
    }
}
