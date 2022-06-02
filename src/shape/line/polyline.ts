import { shapeType } from "../types"
import { Line, LineOptions } from "./line";

export class Polyline extends Line {
    type: shapeType

    constructor(ctx: CanvasRenderingContext2D, opts: LineOptions) {
        super(ctx, opts)
        this.type = 'polyline'
    }
}
