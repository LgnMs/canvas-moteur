import { ShapType } from "../types"

export interface LineOptions {
    points: {x: number, y: number}[]
}

export default class Line {
    type: ShapType
    ctx: CanvasRenderingContext2D
    points: {x: number, y: number}[] = []
    path!: Path2D

    constructor(ctx: CanvasRenderingContext2D, opts: LineOptions) {
        this.type = 'line'
        this.ctx = ctx
        this.points = opts.points
        this.setPath()
    }

    setPath() {
        const path = new Path2D()
        
        this.points.forEach((point, i) => {
            if (i === 0) {
                path.moveTo(point.x, point.y)
            } else {
                path.lineTo(point.x, point.y)
            }
        })
        this.path = path
    }

    draw() {
        const { ctx } = this
        ctx.strokeStyle = 'black'
        ctx.stroke(this.path)
    }
}
