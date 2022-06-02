
export interface PathOptions {
    /**
     * svg path路径
     */
    path: string
}

export class Path {
    type: string
    pathString: string

    ctx: CanvasRenderingContext2D
    path!: Path2D

    constructor(ctx: CanvasRenderingContext2D, opts: PathOptions) {
        this.type = 'path'
        this.ctx = ctx
        this.pathString = opts.path
        this.setPath()
    }

    setPath() {
        this.path = new Path2D(this.pathString)
    }

    draw() {
        const { ctx } = this
        ctx.strokeStyle = 'black'
        ctx.stroke(this.path)
    }
}
