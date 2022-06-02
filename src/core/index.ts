import { createEventListener, EventListener } from "./createEventListener";
import { Canvas, CanvasOptions, createCanvasApi } from "./crateCanvasApi";
import { createDataCenter, DataCenter } from "./createDataCenter";
import { createTransformApi, TransformApi } from "./createTransformApi";
import { render } from "./renderer";
import { crateTempshapeApi, Tempshape } from "./crateTempshape";
import { createshapeApi, shapeApi } from "../shape";

/**
 * 处理canvas的额外功能
 */
export interface Canvashandler {
    dataCenter: DataCenter
    transform: TransformApi
    eventListener: EventListener
    shapeApi: shapeApi
    tempshape: Tempshape
    render(): void
}


export type onshapeDragFn = (e: any, shape: any) => void
/**
 * 在合适的时机调用这些事件
 */
 export interface FunctionProps {
    onshapeDragStart: onshapeDragFn | undefined
    onshapeDragMove: onshapeDragFn | undefined
    onshapeDragEnd: onshapeDragFn | undefined
}

export type CanvasMoteur = Canvas & Canvashandler & FunctionProps

export interface CanvasMoteurOptions {
    canTranslate?: boolean
    canScale?: boolean
}

export function createCanvas(opts: CanvasOptions & CanvasMoteurOptions) {
    const canvasApi = createCanvasApi(opts)

    const canvasMoteur: Canvas & Partial<Canvashandler> = Object.assign(canvasApi, {})

    canvasMoteur.dataCenter = createDataCenter(canvasMoteur as CanvasMoteur)
    canvasMoteur.tempshape = crateTempshapeApi()
    canvasMoteur.render = () => { render(canvasMoteur as CanvasMoteur) }
    canvasMoteur.eventListener = createEventListener(canvasMoteur as CanvasMoteur)

    canvasMoteur.transform = createTransformApi(canvasMoteur as CanvasMoteur, {canTranslate: opts.canTranslate, canScale: opts.canScale})
    canvasMoteur.shapeApi = createshapeApi(canvasMoteur as CanvasMoteur)
    
    return canvasMoteur as CanvasMoteur
}