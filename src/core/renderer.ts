import { Line } from "../shap";
import { Edge, Shap } from "../type";
import { CanvasMoteur } from "./index";

function clearRect(canvasMoteur: CanvasMoteur) {
    const { transform } = canvasMoteur
    const ctx = canvasMoteur.getCtx()

    if (transform.scale < 1) {
        ctx.clearRect(
            -transform.translate.x,
            -transform.translate.y,
            canvasMoteur.width / transform.scale,
            canvasMoteur.height / transform.scale
        )
    } else {
        ctx.clearRect(
            -transform.translate.x / transform.scale,
            -transform.translate.y / transform.scale,
            canvasMoteur.width,
            canvasMoteur.height
        )
    }
}

function renderShaps(shaps: Shap[]) {
    shaps.forEach(shap => {
        shap.draw()
    })
}

function renderEdges(edges: Edge[], ctx: any) {
    // TODO TEMP
    edges.forEach(edge => {
        const line = new Line(ctx, {
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
}

export function render(canvasMoteur: CanvasMoteur) {
    const ctx = canvasMoteur.getCtx()

    clearRect(canvasMoteur)
    renderShaps(canvasMoteur.dataCenter.data.shaps)
    renderEdges(canvasMoteur.dataCenter.data.edges, ctx)

    if (canvasMoteur.tempShap.hasEdge) {
        const line = new Line(ctx, {points: canvasMoteur.tempShap.line})
        line.draw()
    }

    canvasMoteur.dataCenter.recordData()
}