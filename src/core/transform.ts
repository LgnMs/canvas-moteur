import { Canvas } from "./crateCanvasApi";

export interface TransformApi {
    translateCanvas(x: number, y: number) : void
    zoomInCanvas(): void
    zoomOutCanvas(): void
    resetTransform(): void

    onMouseWheel(): void
    onMouseLeave(): void
}

export function createTransformApi(canvas: Canvas) {
    const transform: TransformApi = {
        translateCanvas(x: number, y: number) {
            const { translate, scale, mousedown, canTranslate } = canvas.status

            if (mousedown && canTranslate) {
                translate.x += x;
                translate.y += y;

                canvas._ctx.setTransform(scale, 0, 0, scale, translate.x, translate.y)
                // TODO: this.render(false);
            }
        },

        zoomInCanvas() {
            const { status, _ctx } = canvas
            let { translate, canScale } = status

            if (canScale) {
                status.scale += 0.1

                _ctx.setTransform(status.scale, 0, 0, status.scale, translate.x, translate.y)
                // TODO: this.render(false);
            }
        },

        zoomOutCanvas() {
            const { status } = canvas
            let { translate, canScale } = canvas.status

            if (canScale) {
                status.scale -= 0.1

                canvas._ctx.setTransform(status.scale, 0, 0, status.scale, translate.x, translate.y)
                // TODO: this.render(false);
            }
        },

        resetTransform() {
            canvas._ctx.setTransform(1, 0, 0, 1, 0, 0);
            canvas.status.translate.x = 0
            canvas.status.translate.y = 0
            canvas.status.scale = 1
            // TODO: this.render(false);
        },

        onMouseWheel() {
            canvas.el.addEventListener('wheel', (e) => {
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
            canvas.el.addEventListener('mouseleave', (e) => {
                canvas.status.mousedown = false
            })
        }
    }

    return transform
}
