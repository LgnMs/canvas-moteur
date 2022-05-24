import { DataCenter } from './dataCenter'
import { Line, LineOptions, Circle, CircleOptions, Rect, RectOptions, Img, ImgOptions, Anchor } from './shap'

export type DrawOption = CircleOptions | RectOptions

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

    constructor({el, isTranslate, isScale}: { el: string | HTMLCanvasElement, isTranslate: boolean, isScale: boolean }) {
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
                translate: { x: 0, y: 0},
                scale: 0,
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
        ctx.clearRect(-canvasStatus.translate.x, -canvasStatus.translate.y, this.canvas.width, this.canvas.height);

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

        if (shouldRecodeData) {
            this.dataCenter.recordData()
        }
    }

    initEventListener() {
        this.onmouseover()
        this.ondargstart()
        this.ondargmove()
        this.ondargend()
    }
    
    translateCanvas(x: number, y: number) {
        this.canvasStatus.translate = { x, y }
        this.ctx.translate(x, y);
        this.render();
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
            let shouldRender = false

            // 平移画布
            if (this.canvasStatus.mousedown && this.canvasStatus.isTranslate) {
                this.translateCanvas(e.movementX, e.movementY);
            }

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];

                if (shap.mousedown) {
                    shap.dargmove(e)
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
                            // 鼠标在锚点中点下，应该开始绘制折线
                            this.tempEdge.points[1] = {x: offsetX, y: offsetY}
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
}