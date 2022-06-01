import { CanvasMoteur } from "./index";

export interface TransformApi {
    mousedown: boolean
    translate: {
        x: number
        y: number
    }
    scale: number
    canTranslate: boolean
    canScale: boolean

    translateCanvas(x: number, y: number) : void
    zoomInCanvas(): void
    zoomOutCanvas(): void
    resetTransform(): void

    onMouseWheel(): void
    onMouseLeave(): void
}

export function createTransformApi(canvasMoteur: CanvasMoteur, {canTranslate = false, canScale = false}: {canTranslate?: boolean, canScale?: boolean}) {
    const transform: TransformApi = {
        mousedown: false,
        translate: { x: 0, y: 0 },
        scale: 1,
        canTranslate,
        canScale,

        translateCanvas(x: number, y: number) {
            const { translate, scale, mousedown, canTranslate } = transform

            if (mousedown && canTranslate) {
                translate.x += x;
                translate.y += y;

                canvasMoteur._ctx.setTransform(scale, 0, 0, scale, translate.x, translate.y)
                canvasMoteur.render()
            }
        },

        zoomInCanvas() {
            const { _ctx } = canvasMoteur
            let { translate, canScale } = transform

            if (canScale) {
                transform.scale += 0.1

                _ctx.setTransform(transform.scale, 0, 0, transform.scale, translate.x, translate.y)
                canvasMoteur.render()
            }
        },

        zoomOutCanvas() {
            let { translate, canScale } = transform

            if (canScale) {
                transform.scale -= 0.1

                canvasMoteur._ctx.setTransform(transform.scale, 0, 0, transform.scale, translate.x, translate.y)
                canvasMoteur.render()
            }
        },

        resetTransform() {
            canvasMoteur._ctx.setTransform(1, 0, 0, 1, 0, 0);
            transform.translate.x = 0
            transform.translate.y = 0
            transform.scale = 1
            canvasMoteur.render()
        },

        onMouseWheel() {
            canvasMoteur.el.addEventListener('wheel', (e) => {
                if (e.deltaY < 0) {
                    // 放大
                    transform.zoomInCanvas()
                } else {
                    // 缩小
                    transform.zoomOutCanvas()
                }
    
            })
        },
        onMouseLeave() {
            canvasMoteur.el.addEventListener('mouseleave', (e) => {
                transform.mousedown = false
            })
        }
    }

    return transform
}
