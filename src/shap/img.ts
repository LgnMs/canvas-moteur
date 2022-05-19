import { BasicShape } from './basicShap'
import { ShapBasicOptions } from "./types"

export interface ImgOptions extends ShapBasicOptions {
    width: number
    height: number
    url: string
}

export class Img extends BasicShape {
    width: number
    height: number
    url = ''
    img: HTMLImageElement | undefined

    constructor(ctx: CanvasRenderingContext2D, opts: ImgOptions) {
        super(ctx, opts)
        this.type = 'image'
        this.width = opts.width
        this.height = opts.height
        this.url = opts.url
        this.setPath()
    }

    setPath() {
        const path = new Path2D()

        path.rect(this.x, this.y, this.width, this.height)

        this.path = path
    }

    getAnchorsPostion() {
        const offset = 12

        const leftX = this.x - offset
        const rightX = this.x + this.width + offset
        const topY = this.y - offset
        const bottomY = Math.floor(this.y + this.height) + offset
        const middleX =   Math.floor(this.x + this.width / 2)
        const middleY = Math.floor(this.y + this.height / 2)

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
        const { ctx, x, y, width, height } = this

        if (!this.img) {
            this.img = new Image()
            this.img.src = this.url
            this.img.onload = () => {
                ctx.drawImage(this.img!, this.x, this.y, this.width, this.height)
            }
        } else {
            ctx.drawImage(this.img!, this.x, this.y, this.width, this.height)
        }
        
        console.log(this.active)
        if (this.active) {
            const borderPath = new Path2D()
            borderPath.rect(x - 1, y - 1, width + 2, height + 2)
            ctx.stroke(borderPath)
        }
        if (this.anchors && this.anchors.length > 0) {
            this.darwAnchors(ctx)
        }
    }
    
}