import { Component, COptions } from "../common";

export interface IHTMLComponentOptions {
    position?: {
        x: number;
        y: number;
    },
    name: string;
    style?: Partial<CSSStyleDeclaration>;
}

export class HTMLComponent extends Component {
    style!: Partial<CSSStyleDeclaration>;

    constructor(options: COptions) {
        super(options);
    }
}