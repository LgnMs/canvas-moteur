import BasicShape from "./basicShap"
import { ShapBasicOptions } from "./types"

export interface CircleOptions extends ShapBasicOptions {
    r: number
}

export default class Circle extends BasicShape {
    width = 0
    height = 0
    r = 0

    constructor(ctx: CanvasRenderingContext2D, opts: CircleOptions) {
        super(ctx, opts)
        this.type = 'circle'
        this.width = opts.r * 2
        this.height = opts.r * 2
        this.r = opts.r
        this.setPath()
    }

    setPath() {
        const path = new Path2D()

        path.arc(this.x, this.y, this.r, 0, 2 * Math.PI)

        this.path = path
    }

    getAnchorsPostion() {
        const offset = 12

        const leftX = this.x - this.r - offset
        const rightX = this.x + this.r + offset
        const topY = this.y - this.r - offset
        const bottomY = this.y + this.r + offset
        const middleX = this.x
        const middleY = this.y

        return {
            leftX,
            rightX,
            topY,
            bottomY,
            middleX,
            middleY
        }
    }

    draw() {
        const { ctx } = this
        if (this.active) {
            const borderPath = new Path2D()
            borderPath.arc(this.x, this.y, this.r + 2, 0, 2 * Math.PI)
            ctx.stroke(borderPath)
        }
        if (this.style) {
            ctx.fillStyle = this.style.backgroundColor;
        }
        ctx.fill(this.path!);

        if (this.anchors && this.anchors.length > 0) {
            this.darwAnchors(ctx)
        }
    }
}