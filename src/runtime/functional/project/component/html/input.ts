import { Component, componentTag, componentType, createComponent, IComponent, IComponentOptions } from "../common"
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

    public static new = createComponent<IHTMLComponentOptions, Input>(Input);
}

export const createInput = Input.new;