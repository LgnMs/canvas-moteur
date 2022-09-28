import { Component, componentType, IComponent } from "../common"

export class Rect extends Component implements IComponent {
    constructor(name: string) {
        super(name);
        this.type = componentType.CANVAS;
    }
}
