import { Component, componentTag, componentType, IComponent, IComponentOptions } from "../common"

export class Rect extends Component implements IComponent {
    constructor({ name, style = {width: 0,  height: 0}, position = { x:0, y:0 } }: IComponentOptions) {
        super({
            name,
            type: componentType.Rect,
            tag: componentTag.CANVAS,
        });
        this.position = position;
        this.style = style
    }

    public static new(options: IComponentOptions) {
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
