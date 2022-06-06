import { CanvasMoteur } from '../core'
import { Circle } from './circle'
import { Rect } from './rect'

export * from './basicShape'
export * from './anchor'
export * from './circle'
export * from './img'
export { Line } from './line/line'
export * from './line/polyline'
export * from './path'

export interface shapeApi {
    rect(opts: any): void
    circle(opts: any): void
}

export function createShapeApi(canvasMoteur: CanvasMoteur) {

    const addShapeFunc = (shapeFunc: any, opts: any) => {
        const shape = new shapeFunc(canvasMoteur._ctx, opts)
        canvasMoteur.dataCenter.data.shapes.push(shape)
        canvasMoteur.dataCenter.shouldRecode()
        canvasMoteur.dataCenter.recordData()
        return shape
    }
    const shapes: shapeApi = {
        rect: (opts: any) => addShapeFunc(Rect, opts),
        circle: (opts: any) => addShapeFunc(Circle, opts)
    }

    return shapes
}