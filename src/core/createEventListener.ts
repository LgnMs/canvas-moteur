import { warn } from "../warning"
import { CanvasMoteur } from "./index"

function onMouseOver(canvasMoteur: CanvasMoteur) {
    canvasMoteur.el.addEventListener('mousemove', (e) => {
        const dataCenter = canvasMoteur.dataCenter
        const { offsetX, offsetY } = e
        const ctx = canvasMoteur.getCtx()
        const shaps = dataCenter.data.shaps

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
            // render(false)
        }
    })
}

function onDargStart(canvasMoteur: CanvasMoteur) {
    canvasMoteur.el.addEventListener('mousedown', (e) => {
        const dataCenter = canvasMoteur.dataCenter
        const { offsetX, offsetY } = e
        const ctx = canvasMoteur.getCtx()
        const shaps = dataCenter.data.shaps

        canvasMoteur.status.mousedown = true

        for (let i = 0; i < shaps.length; i++) {
            const shap = shaps[i];

            if (ctx.isPointInPath(shap.path, offsetX, offsetY)) {
                shap.dargstart()
                canvasMoteur.status.mousedown = false

                if (canvasMoteur.onShapDragStart) {
                    canvasMoteur.onShapDragStart(e, shap)
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

                            canvasMoteur.status.mousedown = false
                            canvasMoteur.tempShap.setEdge({
                                source: {
                                    shap,
                                    anchorIndex: j
                                }
                            })
                            canvasMoteur.tempShap.setLine([{x: anchor.x, y: anchor.y}])

                            if (canvasMoteur.onShapDragStart) {
                                canvasMoteur.onShapDragStart(e, anchor)
                            }
                        }
                        break
                    }
                }
            }
        }
        
    })
}

function onDargMove(canvasMoteur: CanvasMoteur) {
    canvasMoteur.el.addEventListener('mousemove', (e) => {
        const dataCenter = canvasMoteur.dataCenter
        const { offsetX, offsetY } = e
        const { shaps } = dataCenter.data
        const { translate, scale } = canvasMoteur.status
        let shouldRender = false

        canvasMoteur.transform!.translateCanvas(e.movementX , e.movementY );

        for (let i = 0; i < shaps.length; i++) {
            const shap = shaps[i];

            if (shap.mousedown) {
                shap.dargmove({
                    moveX: e.movementX / scale,
                    moveY: e.movementY / scale
                })
                shouldRender = true

                if (canvasMoteur.onShapDragMove) {
                    canvasMoteur.onShapDragMove(e, shap)
                }
                break
            }

            // 锚点逻辑
            if (shap.hasAnchor) {
                for (let j = 0; j < shap.anchorList.length; j++) {
                    const anchor = shap.anchorList[j]
                    
                    // TODO
                    if (anchor.mousedown && canvasMoteur.tempShap.hasEdge) {
                        canvasMoteur.tempShap.setLine([
                            ...canvasMoteur.tempShap.line,
                            {
                                x: (offsetX - translate.x) / scale,
                                y: (offsetY - translate.y) / scale
                            }
                        ])
                        shouldRender = true

                        if (canvasMoteur.onShapDragMove) {
                            canvasMoteur.onShapDragMove(e, anchor)
                        }
                        break
                    }

                }
            }

        }

        if (shouldRender) {
            // TODO
            // this.render(false)
        }
    })
}

function ondargend(canvasMoteur: CanvasMoteur) {
    canvasMoteur.el.addEventListener('mouseup', (e) => {
        const dataCenter = canvasMoteur.dataCenter
        const { offsetX, offsetY } = e
        const ctx = canvasMoteur.getCtx()
        const shaps = dataCenter.data.shaps
        let shouldRender = false
        let shouldRecodeData = false
        canvasMoteur.status.mousedown = false

        for (let i = 0; i < shaps.length; i++) {
            const shap = shaps[i];

            if (shap.mousedown) {
                shap.dargend()
                shouldRender = true
                shouldRecodeData = true

                if (canvasMoteur.onShapDragEnd) {
                    canvasMoteur.onShapDragEnd(e, shap)
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

                        if (canvasMoteur.tempShap.hasEdge) {
                            canvasMoteur.tempShap.setEdge({ target: { shap, anchorIndex: j} })
                            canvasMoteur.tempShap.removeLine()

                            canvasMoteur.dataCenter.data.edges.push(canvasMoteur.tempShap.edge)
                            canvasMoteur.tempShap.removeEdge()
                        }

                        shouldRender = true
                        shouldRecodeData = true
                        
                        if (canvasMoteur.onShapDragEnd) {
                            canvasMoteur.onShapDragEnd(e, anchor)
                        }

                        // 鼠标在锚点中松开，终止循环
                        break
                    }

                }

            }
        }

        if (canvasMoteur.tempShap.hasEdge) {
            canvasMoteur.tempShap.removeLine()
            canvasMoteur.tempShap.removeEdge()
            shouldRender = true
        }

        if (shouldRender) {
            // canvas.render(shouldRecodeData)
        }
        
    })
}
export interface EventListener {
    addEventListener(fn: Function): void
    removeEventListener(fn: Function): void
    initEventListener(): void
}


export function createEventListener(canvasMoteur: CanvasMoteur) {
    let events = new Set<Function>()

    const closure = (event: Function) => {
        return event(canvasMoteur)
    }

    const eventListener: EventListener = {
        addEventListener(fn) {
            if (events.has(fn)) {
                warn('这个事件已经监听过了')
            } else {
                events.add(fn)
            }
        },
        
        removeEventListener(fn: Function) {
            if (events.has(fn)) {
                events.delete(fn)
            } else {
                warn('没有监听这个事件')
            }
        },

        initEventListener() {
            events.forEach(fn => {
                closure(fn)
            })
        },
    }

    eventListener.addEventListener(onMouseOver)
    eventListener.addEventListener(onDargStart)
    eventListener.addEventListener(onDargMove)
    eventListener.addEventListener(ondargend)

    return eventListener
}