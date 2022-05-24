import { DataCenter } from './dataCenter'
import { Line, LineOptions, Circle, CircleOptions, Rect, RectOptions, Img, ImgOptions, Anchor } from './shap'

export type DrawShapOption = CircleOptions | RectOptions

export type ShapTypeMap = Rect | Circle

/**
 * 线的点
 */
export interface EdgePoint {
    shap: ShapTypeMap
    anchorIndex: number
}

export interface Edge {
    source: EdgePoint
    target: EdgePoint
}

type onShapDragFn = (e: any, shap: ShapTypeMap | Anchor) => void

interface CanvasStatus {
    mousedown: boolean
    translate: {
        x: number
        y: number
    }
    scale: number
    isTranslate: boolean
    isScale: boolean
}
export class Draw {
    canvas: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    shaps: ShapTypeMap[] = []

    tempEdge: Line | null = null
    tempEdgeSource: EdgePoint | null = null
    edges: Edge[] = []
    dataCenter: DataCenter
    canvasStatus: CanvasStatus

    onShapDragStart: onShapDragFn | undefined;
    onShapDragMove: onShapDragFn | undefined;
    onShapDragEnd: onShapDragFn | undefined;

    constructor({el, isTranslate = false, isScale = false}: { el: string | HTMLCanvasElement, isTranslate?: boolean, isScale?: boolean }) {
        let canvas = null
        
        
        if (typeof el === 'string') {
            canvas = document.getElementById(el) as HTMLCanvasElement
        } else {
            canvas = el
        }
        this.canvas = canvas

        if (canvas.getContext){
            this.ctx = canvas.getContext('2d')!;
            this.initEventListener()
            this.dataCenter = new DataCenter(this)
            this.canvasStatus = {
                mousedown: false,
                translate: { x: 0, y: 0 },
                scale: 1,
                isTranslate,
                isScale,
            }
        } else {
            throw new Error('浏览器不支持canvas');
        }
    }

    addRect(opts: RectOptions) {
        const shap = new Rect(this.ctx, opts);
        this.shaps.push(shap)

        return shap
    }
    addCircle(opts: CircleOptions) {
        const shap = new Circle(this.ctx, opts);

        this.shaps.push(shap)

        return shap
    }
    addImg(opts: ImgOptions) {
        const shap = new Img(this.ctx, opts)

        this.shaps.push(shap)

        return shap
    }

    addEdge(edge: Edge) {
        this.edges.push(edge)
    }

    addTempEdge(opts: LineOptions) {
        const shap = new Line(this.ctx, opts)
        this.tempEdge = shap
        
        return shap
    }

    render(shouldRecodeData = true) {
        const { ctx, canvasStatus } = this

        if (canvasStatus.scale < 1) {
            ctx.clearRect(
                -canvasStatus.translate.x,
                -canvasStatus.translate.y,
                this.canvas.width / canvasStatus.scale,
                this.canvas.height / canvasStatus.scale
            )
        } else {
            ctx.clearRect(
                -canvasStatus.translate.x / canvasStatus.scale,
                -canvasStatus.translate.y / canvasStatus.scale,
                this.canvas.width,
                this.canvas.height
            )
        }

        this.shaps.forEach(shap => {
            shap.draw()
        })
        this.edges.forEach(edge => {
            const line = new Line(this.ctx, {
                // 锚点连接线的点位计算
                points: [
                    { 
                        x: edge.source.shap.anchorList[edge.source.anchorIndex].x, 
                        y: edge.source.shap.anchorList[edge.source.anchorIndex].y
                    }, 
                    {
                        x: edge.target.shap.anchorList[edge.target.anchorIndex].x,
                        y: edge.target.shap.anchorList[edge.target.anchorIndex].y 
                    }
                ]
            })
            line.draw()
        })

        if (this.tempEdge) {
            this.tempEdge.setPath()
            this.tempEdge.draw()
        }

        console.log(shouldRecodeData)
        if (shouldRecodeData) {
            this.dataCenter.recordData()
        }

        // this.debug()

    }

    initEventListener() {
        this.onmouseover()
        this.ondargstart()
        this.ondargmove()
        this.ondargend()
        this.onMouseWheel()
        this.onMouseLeave()
    }
    
    translateCanvas(x: number, y: number) {
        // 平移画布
        const { translate, scale, mousedown, isTranslate } = this.canvasStatus
        if (mousedown && isTranslate) {
            translate.x += x;
            translate.y += y;

            this.ctx.setTransform(scale, 0, 0, scale, translate.x, translate.y)
            this.render(false);
        }
    }

    zoomInCanvas() {
        const { canvasStatus } = this
        let { translate, isScale } = this.canvasStatus

        if (isScale) {
            canvasStatus.scale += 0.1

            this.ctx.setTransform(canvasStatus.scale, 0, 0, canvasStatus.scale, translate.x, translate.y)
            this.render(false);
        }
    }
    
    zoomOutCanvas() {
        const { canvasStatus } = this
        let { translate, isScale } = this.canvasStatus

        if (isScale) {
            canvasStatus.scale -= 0.1

            this.ctx.setTransform(canvasStatus.scale, 0, 0, canvasStatus.scale, translate.x, translate.y)
            this.render(false);
        }
    }

    resetTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasStatus.translate.x = 0
        this.canvasStatus.translate.y = 0
        this.canvasStatus.scale = 1
        this.render(false)
    }

    debug() {
        // 绘制坐标系
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 5]);
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        // this.ctx.stroke()

        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);

        this.ctx.stroke()
        this.ctx.restore()
    }

    onmouseover() {
        this.canvas.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e
            const { ctx, shaps } = this

            let shouldRender = false

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];
                // 当鼠标处于路径中的时候激活所属路径，并展示明显的提示
                if (ctx.isPointInPath(shap.path!, offsetX, offsetY)) {
                    if (shap.active !== true) {
                        shap.onmouseover()
                        shouldRender = true
                    }
                    break
                } 

                // 判断鼠标是否在锚点中
                if (shap.hasAnchor) {
                    for (let j = 0; j < shap.anchorList.length; j++) {
                        const anchor = shap.anchorList[j]
                        
                        if (ctx.isPointInPath(anchor.path, offsetX, offsetY)) {
                            if (anchor.active !== true) {
                                anchor.active = true
                                shouldRender = true
                            }
                            break
                        }

                        if (anchor.active === true) {
                            shouldRender = true
                            anchor.active = false
                        }
                    }
                }

                // 如果鼠标shap中但是它是激活状态，那么就表明鼠标已经移出了该shap
                if (shap.active === true) {
                    shouldRender = true
                    shap.onmouseleave()
                }
            } 

            if (shouldRender) {
                this.render(false)
            }
        })
    }

    ondargstart() {
        this.canvas.addEventListener('mousedown', (e) => {
            const { offsetX, offsetY } = e
            const { ctx, shaps } = this

            this.canvasStatus.mousedown = true

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];

                if (ctx.isPointInPath(shap.path, offsetX, offsetY)) {
                    shap.dargstart()
                    this.canvasStatus.mousedown = false

                    if (this.onShapDragStart) {
                        this.onShapDragStart(e, shap)
                    }
                    break
                }

                // 判断鼠标是否在锚点中
                if (shap.hasAnchor) {
                    for (let j = 0; j < shap.anchorList.length; j++) {
                        const anchor = shap.anchorList[j]
                        
                        if (ctx.isPointInPath(anchor.path, offsetX, offsetY)) {
                            if (anchor.mousedown !== true) {
                                anchor.mousedown = true
                                this.canvasStatus.mousedown = false
                                
                                this.addTempEdge({
                                    points: [{x: anchor.x, y: anchor.y}]
                                })
                                this.tempEdgeSource = {
                                    shap,
                                    anchorIndex: j
                                }

                                if (this.onShapDragStart) {
                                    this.onShapDragStart(e, anchor)
                                }
                            }
                            break
                        }
                    }
                }
            }
            
        })
    }

    ondargmove() {
        this.canvas.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e
            const { shaps } = this
            const { translate, scale } = this.canvasStatus
            let shouldRender = false

            this.translateCanvas(e.movementX , e.movementY );

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];

                if (shap.mousedown) {
                    shap.dargmove({
                        moveX: e.movementX / scale,
                        moveY: e.movementY / scale
                    })
                    shouldRender = true

                    if (this.onShapDragMove) {
                        this.onShapDragMove(e, shap)
                    }
                    break
                }

                // 锚点逻辑
                if (shap.hasAnchor) {
                    for (let j = 0; j < shap.anchorList.length; j++) {
                        const anchor = shap.anchorList[j]
                        
                        if (anchor.mousedown && this.tempEdge) {
                            this.tempEdge.points[1] = {
                                x: (offsetX - translate.x) / scale,
                                y: (offsetY - translate.y) / scale
                            }
                            shouldRender = true

                            if (this.onShapDragMove) {
                                this.onShapDragMove(e, anchor)
                            }
                            break
                        }

                    }
                }

            }

            if (shouldRender) {
                this.render(false)
            }
        })
    }

    ondargend() {

        this.canvas.addEventListener('mouseup', (e) => {
            const { offsetX, offsetY } = e
            const { ctx, shaps } = this
            let shouldRender = false
            let shouldRecodeData = false
            this.canvasStatus.mousedown = false

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];

                if (shap.mousedown) {
                    shap.dargend()
                    shouldRender = true
                    shouldRecodeData = true

                    if (this.onShapDragEnd) {
                        this.onShapDragEnd(e, shap)
                    }
                    break
                }

                // 锚点逻辑
                if (shap.hasAnchor) {
                    for (let j = 0; j < shap.anchorList.length; j++) {
                        const anchor = shap.anchorList[j]

                        // 松开鼠标重置属性
                        anchor.mousedown = false

                        if (ctx.isPointInPath(anchor.path, offsetX, offsetY)) {
                            // 鼠标松开时在锚点中 TODO: 考虑在同一锚点的情况
                            this.tempEdge!.points[1] = {x: anchor.x, y: anchor.y}

                            this.addEdge({
                                source: this.tempEdgeSource!,
                                target: {
                                    shap,
                                    anchorIndex: j
                                }
                            })
                            // this.shaps.push(this.tempEdge)

                            this.tempEdge = null
                            shouldRender = true
                            shouldRecodeData = true
                            
                            if (this.onShapDragEnd) {
                                this.onShapDragEnd(e, anchor)
                            }
                            // 鼠标在锚点中松开，终止循环
                            break
                        }

                    }

                }
            }

            if (this.tempEdge) {
                this.tempEdge = null
                shouldRender = true
            }

            if (shouldRender) {
                this.render(shouldRecodeData)
            }
            
        })
    }

    onMouseWheel() {
        // TODO scale值重新计算
        this.canvas.addEventListener('wheel', (e) => {
            if (e.deltaY < 0) {
                // 放大
                this.zoomInCanvas()
            } else {
                // 缩小
                this.zoomOutCanvas()
            }

        })
    }

    onMouseLeave() {
        this.canvas.addEventListener('mouseleave', (e) => {
            this.canvasStatus.mousedown = false
        })
    }
}