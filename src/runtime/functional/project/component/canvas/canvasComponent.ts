import { Component, COptions } from "../common";
import { ComponentStyle } from "../style";

export interface ICanvasComponentOptions {
    position?: {
        x: number;
        y: number;
    },
    name: string;
    style?: ComponentStyle;
}

export class CanvasComponent extends Component {
    style!: ComponentStyle;
    mesh?: THREE.Mesh;

    constructor(options: COptions) {
        super(options);
    }
}