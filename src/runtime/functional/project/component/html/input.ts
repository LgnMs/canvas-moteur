import { Component, componentTag, componentType, IComponent, IComponentOptions } from "../common"
import { HTMLComponent, IHTMLComponentOptions } from "./htmlComponent";

export class Input extends HTMLComponent {
    constructor({name, style}: IHTMLComponentOptions) {
        super({
            name,
            type: componentType.Input,
            tag: componentTag.HTML
        });

        
        this.style = { position: 'relative', ...style};
    }

    public static new(options: IHTMLComponentOptions) {
        const target = new Input(options);

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
