import { warn } from "../shared/warning"
import { CanvasMoteur } from "./index"
import { Shape } from "../type"
import {Anchor} from "../shape";

interface PointInShapeObj {
    shape: Shape | null
    shapeIndex: number
    anchor: Anchor | null
    anchorIndex: number
}

export function pointInfShapeIsNull(pointInShapeObj: PointInShapeObj) {
    return !pointInShapeObj.shape && !pointInShapeObj.anchor
}

function pointInShape(canvasMoteur: CanvasMoteur, point: {x: number, y: number}) {
    const dataCenter = canvasMoteur.dataCenter
    const { x, y } = point
    const ctx = canvasMoteur.getCtx()
    const shapes = dataCenter.data.shapes
    let obj: PointInShapeObj = {
        shape: null,
        shapeIndex: -1,
        anchor: null,
        anchorIndex: -1
    }

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        if (ctx.isPointInPath(shape.path, x, y)) {
            obj.shape = shape
            obj.shapeIndex = i
            break
        }

        // 判断鼠标是否在锚点中
        if (shape.hasAnchor) {
            for (let j = 0; j < shape.anchorList.length; j++) {
                const anchor = shape.anchorList[j]

                if (ctx.isPointInPath(anchor.path, x, y)) {
                    obj.shape = shape
                    obj.shapeIndex = i
                    obj.anchor = anchor
                    obj.anchorIndex = j
                    break
                }
            }
        }
    }
    return obj
}

function mouseOverDefault(e: MouseEvent, target: PointInShapeObj) {
    if (target.anchor) {
        target.anchor.onmouseover()
    } else if (target.shape) {
        target.shape.onmouseover()
    }
}

function dragStartDefault(e: MouseEvent, target: PointInShapeObj, canvasMoteur: CanvasMoteur) {
    // 开始移动元素的时候禁止画布移动
    canvasMoteur.transform.setDisabledTranslate(true)


    if (target.anchor) {
        target.anchor.mousedown = true
        canvasMoteur.tempshape.setEdge({
            source: {
                shape: target.shape!,
                anchorIndex: target.anchorIndex
            }
        })
        canvasMoteur.tempshape.setLine([{x: target.anchor!.x, y: target.anchor!.y}])
        if (canvasMoteur.onshapeDragStart) {
            canvasMoteur.onshapeDragStart(e, target.anchor)
        }
    } else if (target.shape) {
        target.shape.dragstart()
        if (canvasMoteur.onshapeDragStart) {
            canvasMoteur.onshapeDragStart(e, target.shape)
        }
    }
}

function dragMoveDefault(e: MouseEvent, target: PointInShapeObj, canvasMoteur: CanvasMoteur) {
    const { translate, scale } = canvasMoteur.transform
    const { offsetX, offsetY } = e
    if (target.anchor) {
        if (canvasMoteur.tempshape.hasEdge) {
            canvasMoteur.tempshape.setLine([
                canvasMoteur.tempshape.line[0],
                {
                    x: (offsetX - translate.x) / scale,
                    y: (offsetY - translate.y) / scale
                }
            ])
        }
        if (canvasMoteur.onshapeDragMove) {
            canvasMoteur.onshapeDragMove(e, target.anchor)
        }
    } else if (target.shape) {
        target.shape.dragmove({
            moveX: e.movementX / scale,
            moveY: e.movementY / scale
        })
        if (canvasMoteur.onshapeDragMove) {
            canvasMoteur.onshapeDragMove(e, target.shape)
        }
    }



}

function dragEndDefault(e: MouseEvent, target: PointInShapeObj, canvasMoteur: CanvasMoteur) {
    if (pointInfShapeIsNull(target)) {
        if (canvasMoteur.tempshape.hasEdge) {
            canvasMoteur.tempshape.removeLine()
            canvasMoteur.tempshape.removeEdge()
        }
    }

    if (target.anchor) {
        if (canvasMoteur.tempshape.hasEdge) {
            canvasMoteur.tempshape.setEdge({ target: { shape: target.shape!, anchorIndex: target.anchorIndex } })
            canvasMoteur.tempshape.removeLine()

            canvasMoteur.dataCenter.data.edges.push(canvasMoteur.tempshape.edge!)
            canvasMoteur.tempshape.removeEdge()
        }
        if (canvasMoteur.onshapeDragEnd) {
            canvasMoteur.onshapeDragEnd(e, target.anchor)
        }
    } else if (target.shape) {
        target.shape.dragend()
        if (canvasMoteur.onshapeDragEnd) {
            canvasMoteur.onshapeDragEnd(e, target.shape)
        }
    }
    canvasMoteur.dataCenter.shouldRecode()
}

export type ListenerCb = (e: MouseEvent, target: PointInShapeObj, c: CanvasMoteur) => void
/**
 * 自定义事件
 */
export interface Listeners {
    /**
     * 鼠标移入元素时
     */
    mouseover: Set<ListenerCb>
    /**
     * 鼠标拖拽元素时
     */
    dragstart: Set<ListenerCb>
    /**
     * 鼠标移动元素时
     */
    dragmove: Set<ListenerCb>
    /**
     * 鼠标拖拽元素结束
     */
    dragend: Set<ListenerCb>
}
type ListenerType = keyof Listeners

export interface EventListener {
    addEventListener(type: ListenerType, fn: ListenerCb): void
    removeEventListener(type: ListenerType , fn: ListenerCb): void
    initEventListener(): void
}

export function createEventListener(canvasMoteur: CanvasMoteur) {
    let events: Listeners = {
        mouseover: new Set(),
        dragstart: new Set(),
        dragmove: new Set(),
        dragend: new Set(),
    }

    const eventListener: EventListener = {
        addEventListener(type, fn) {
            if (events[type].has(fn)) {
                warn('这个事件已经监听过了')
            } else {
                events[type].add(fn)
            }
        },
        
        removeEventListener(type, fn) {
            if ( events[type].has(fn)) {
                events[type].delete(fn)

            } else {
                warn('没有监听这个事件')
            }
        },

        initEventListener() {
            let mouseoverTarget: PointInShapeObj | null = null
            let dragTarget: PointInShapeObj | null = null

            canvasMoteur.el.addEventListener('mousemove', (e) => {

                for (let event of events['mouseover'].values()) {
                    const { offsetX, offsetY } = e
                    const oldTarget = mouseoverTarget

                    mouseoverTarget = pointInShape(canvasMoteur, {x: offsetX, y: offsetY})

                    if (pointInfShapeIsNull(mouseoverTarget) && oldTarget && !pointInfShapeIsNull(oldTarget)) {
                        if (oldTarget.anchor) {
                            oldTarget.anchor.active = false
                        } else if (oldTarget.shape) {
                            oldTarget.shape.active = false
                        }
                        canvasMoteur.render()
                    } else {
                        event(e, mouseoverTarget, canvasMoteur)
                        canvasMoteur.render()
                    }


                }

                for (let event of events['dragmove'].values()) {
                    if (dragTarget) {
                        event(e, dragTarget, canvasMoteur)
                        canvasMoteur.render()
                    }
                }
            })

            canvasMoteur.el.addEventListener('mousedown', (e) => {
                for (let event of events['dragstart'].values()) {
                    const {offsetX, offsetY} = e
                    const target = pointInShape(canvasMoteur, {x: offsetX, y: offsetY})

                    if (!pointInfShapeIsNull(target)) {
                        dragTarget = target
                        event(e, target, canvasMoteur)
                    }
                }
            })


            canvasMoteur.el.addEventListener('mouseup', (e) => {
                for (let event of events['dragend'].values()) {
                    const {offsetX, offsetY} = e

                    // 有拖动的元素才去触发dragend事件
                    if (dragTarget) {
                        const target = pointInShape(canvasMoteur, {x: offsetX, y: offsetY})
                        event(e, target, canvasMoteur)
                        canvasMoteur.render()

                        dragTarget = null
                    }

                    // 在移动完元素后允许画布能够被拖动
                    canvasMoteur.transform.setDisabledTranslate(false)
                }
            })
        },
    }
    eventListener.initEventListener()

    eventListener.addEventListener('mouseover', mouseOverDefault)
    eventListener.addEventListener('dragstart', dragStartDefault)
    eventListener.addEventListener('dragmove', dragMoveDefault)
    eventListener.addEventListener('dragend', dragEndDefault)

    return eventListener
}