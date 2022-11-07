import { Component, componentTag, componentType, createComponent, IComponent, IComponentOptions } from "../common"
import { HTMLComponent, IHTMLComponentOptions } from "./htmlComponent";

export class Input extends HTMLComponent {
    constructor(options: IHTMLComponentOptions) {
        super({
            ...options,
            type: componentType.Input,
            tag: componentTag.HTML
        });

        
        this.style = { position: 'relative', ...options.style};
    }

    public static new = createComponent<IHTMLComponentOptions, Input>(Input);
}

export const createInput = Input.new;