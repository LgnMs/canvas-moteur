export interface AnchorOptions {
    x: number
    y: number
    r: number
    active: boolean
    mousedown: boolean
}

/**
 * 锚点
 */
export class Anchor {
    type = 'anchor'

    ctx: CanvasRenderingContext2D
    x: number
    y: number
    r: number
    path!: Path2D
    active: boolean
    mousedown: boolean

    constructor(ctx: CanvasRenderingContext2D, opts: AnchorOptions) {
        this.ctx = ctx
        this.x = opts.x
        this.y = opts.y
        this.r = opts.r
        this.active = opts.active
        this.mousedown = opts.mousedown

        this.setPath()
    }

    setPath() {
        const path = new Path2D();
        path.arc(this.x, this.y, this.r, 0, 2 * Math.PI)

        this.path = path
    }
    
    draw() {
        if (this.active) {
            this.ctx.strokeStyle = 'red'
        } else {
            this.ctx.strokeStyle = 'black'
        }
        this.ctx.stroke(this.path!)
    }
}