import { createEventListener, EventListener } from "./createEventListener";
import { Canvas, CanvasOptions, createCanvasApi } from "./crateCanvasApi";
import { createDataCenter, DataCenter } from "./createDataCenter";
import { createTransformApi, TransformApi } from "./createTransformApi";
import { render } from "./renderer";
import { crateTempshapApi, TempShap } from "./crateTempshap";

/**
 * 处理canvas的额外功能
 */
export interface Canvashandler {
    dataCenter: DataCenter
    transform: TransformApi
    eventListener: EventListener
    tempShap: TempShap
    render(): void
}


export type onShapDragFn = (e: any, shap: any) => void
/**
 * 在合适的时机调用这些事件
 */
 export interface FunctionProps {
    onShapDragStart: onShapDragFn | undefined
    onShapDragMove: onShapDragFn | undefined
    onShapDragEnd: onShapDragFn | undefined
}

export type CanvasMoteur = Canvas & Canvashandler & FunctionProps

export interface CanvasMoteurOptions {
    canTranslate?: boolean
    canScale?: boolean
}

export function createCanvas(opts: CanvasOptions & CanvasMoteurOptions) {
    const canvasApi = createCanvasApi(opts)

    const canvasMoteur: Canvas & Partial<Canvashandler> = Object.assign(canvasApi, {})

    canvasMoteur.dataCenter = createDataCenter(canvasApi)
    canvasMoteur.tempShap = crateTempshapApi()

    canvasMoteur.render = () => { render(canvasMoteur as CanvasMoteur) }

    canvasMoteur.transform = createTransformApi(canvasMoteur as CanvasMoteur, {canTranslate: opts.canTranslate, canScale: opts.canScale})
    canvasMoteur.eventListener = createEventListener(canvasMoteur as CanvasMoteur)
    canvasMoteur.eventListener.addEventListener(canvasMoteur.transform.onMouseWheel)
    canvasMoteur.eventListener.addEventListener(canvasMoteur.transform.onMouseLeave)

    return canvasMoteur as CanvasMoteur
}