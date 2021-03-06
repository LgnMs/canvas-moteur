import { Anchor } from "./anchor"
import { anchorPosition, shapeBasicOptions, shapeStyle, shapeType } from "./types"

let createshapeNumber = 1

const getId = () => {
    const id = new Date().getTime() + '_i_' + createshapeNumber
    createshapeNumber += 1

    return id
}

export abstract class BasicShape {
    id: string

    ctx: CanvasRenderingContext2D
    
    type: shapeType = ''
    style: shapeStyle | undefined
    path!: Path2D

    active = false
    mousedown = false
    hasAnchor = false
    anchors: anchorPosition[] = []
    anchorList: Anchor[] = []
    data: any

    private _x = 0
    private _y = 0

    constructor(ctx: CanvasRenderingContext2D, opts: shapeBasicOptions) {
        this.id = getId()

        this.ctx = ctx
        this.x = opts.x
        this.y = opts.y

        if (opts.anchors) {
            this.anchors = opts.anchors
            if (opts.anchors.length > 0) {
                this.hasAnchor = true
            }
        }

        this.style = opts.style
        this.data = opts.data
    }

    abstract setPath(): void;
    
    set x(value) {
        this._x = value;
        this.setPath()
        this.anchorList = []
    }
    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        this.setPath()
        this.anchorList = []
    }
    get y() {
        return this._y;
    }


    abstract getAnchorsPostion(): { [x: string]: number };

    darwAnchors(ctx: CanvasRenderingContext2D) {
        const R = 6
        let hasAnchors = false
        if (this.anchorList.length !== 0) {
            hasAnchors = true
        }

        this.anchors.forEach((anchor, i) => {
            const { leftX, middleY, rightX, middleX, topY, bottomY } = this.getAnchorsPostion()
            let x = 0, y = 0
            if (anchor === 'left') {
                x = leftX
                y = middleY
            }
            if (anchor === 'right') {
                x = rightX
                y = middleY
            }
            if (anchor === 'top') {
                x = middleX
                y = topY
            }
            if (anchor === 'bottom') {
                x = middleX
                y = bottomY
            }

            // ???????????????????????????
            if (!hasAnchors) {
                const anchorInstance = new Anchor(ctx, {
                    x,
                    y,
                    r: R,
                    active: false,
                    mousedown: false
                })
                this.anchorList.push(anchorInstance)
            }
            this.anchorList[i].x = x
            this.anchorList[i].y = y
            this.anchorList[i].setPath()
            this.anchorList[i].draw()
        })
    }

    onmouseover() {
        this.active = true
    }

    onmouseleave() {
        this.active = false
    }

    dragstart() {
        this.mousedown = true
    }

    dragmove({moveX, moveY}: {moveX: number, moveY: number}) {
        this.x += moveX
        this.y += moveY
    }

    dragend() {
        this.mousedown = false
    }
    
    abstract draw(): void;

}