import { Line, LineOptions, Circle, CircleOptions, Rect, RectOptions, Img, ImgOptions, Anchor } from './shap'

export type DrawOption = CircleOptions | RectOptions

type ShapTypeMap = Rect | Circle

/**
 * 线的点
 */
interface EdgePoint {
    shap: ShapTypeMap
    anchorIndex: number
}

interface Edge {
    source: EdgePoint
    target: EdgePoint
}

type onShapDragFn = (e: any, shap: ShapTypeMap | Anchor) => void
export class Draw {
    canvas: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    shaps: ShapTypeMap[] = []

    tempEdge: Line | null = null
    tempEdgeSource: EdgePoint | null = null
    edges: Edge[] = []

    onShapDragStart: onShapDragFn | undefined;
    onShapDragMove: onShapDragFn | undefined;
    onShapDragEnd: onShapDragFn | undefined;

    constructor(el: string | HTMLCanvasElement) {
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

    render() {
        const { ctx } = this
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    }

    initEventListener() {
        this.onmouseover()
        this.ondargstart()
        this.ondargmove()
        this.ondargend()
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
                this.render()
            }
        })
    }

    ondargstart() {
        this.canvas.addEventListener('mousedown', (e) => {
            const { offsetX, offsetY } = e
            const { ctx, shaps } = this

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
                this.render()
            }
        })
    }

    ondargend() {
        this.canvas.addEventListener('mouseup', (e) => {
            const { offsetX, offsetY } = e
            const { ctx, shaps } = this
            let shouldRender = false

            for (let i = 0; i < shaps.length; i++) {
                const shap = shaps[i];

                if (shap.mousedown) {
                    shap.dargend()
                    shouldRender = true

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
                this.render()
            }
            
        })
    }
}