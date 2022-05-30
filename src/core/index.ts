import { bindEvents } from "./bindEvents";
import { CanvasOptions, createCanvasApi } from "./crateCanvasApi";
import { createDataCenter } from "./createDataCenter";

export function createCanvas(opts: CanvasOptions) {
    const canvas = createCanvasApi(opts)
    const dataCenter = createDataCenter(canvas)

    bindEvents(canvas, dataCenter)

}