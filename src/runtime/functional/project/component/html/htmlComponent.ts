import { Component, COptions } from "../common";

export interface IHTMLComponentOptions {
    id?: string;
    layerId: string;
    position?: {
        x: number;
        y: number;
    },
    name: string;
    style?: Partial<CSSStyleDeclaration>;
    script?: {
        type: string;
        path: string;
    }
}

export class HTMLComponent extends Component {
    style!: Partial<CSSStyleDeclaration>;
    el?: HTMLElement;

    constructor(options: COptions) {
        super(options);
    }

    public setEl(el: HTMLElement) {
        this.el = el;
    }

    public setStyle(style: Partial<CSSStyleDeclaration>) {
        if (this.el) {
            Object.keys(style).forEach(key => {
                Reflect.set(this.el!.style, key, Reflect.get(style, key))
            })
        }
    }
}