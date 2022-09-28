import { Component, componentType, IComponent } from "../common"

export class Input extends Component implements IComponent {
    constructor(name: string) {
        super(name);
        this.type = componentType.HTML;
    }
}
