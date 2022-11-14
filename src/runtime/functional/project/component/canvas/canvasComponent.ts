import { Component, COptions } from "../common";
import { ComponentStyle } from "../style";

export interface ICanvasComponentOptions {
    id?: string;
    layerId: string;
    position?: {
        x: number;
        y: number;
    },
    name: string;
    style?: ComponentStyle;
    script?: {
        type: string;
        path: string;
    }
}

export class CanvasComponent extends Component {
    style!: ComponentStyle;
    mesh?: THREE.Mesh;

    constructor(options: COptions) {
        super(options);
    }
}