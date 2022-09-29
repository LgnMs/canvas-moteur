import { Component, componentTag, IComponent } from "../common"

export class Rect extends Component implements IComponent {
    constructor(name: string) {
        super(name, 'rect', componentTag.CANVAS);
    }

    public static new(name: string) {
        return new Rect(name);
    }
}
