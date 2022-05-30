import { DataCenter } from "./createDataCenter";
import { Canvas } from "./crateCanvasApi";

function onMouseOver(canvas: Canvas, dataCenter: DataCenter) {
    canvas._el.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY } = e
        const ctx = canvas.getCtx()
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

// TODO: 其它几项监听
export function bindEvents(canvas: Canvas, dataCenter: DataCenter) {
    onMouseOver(canvas, dataCenter)
}