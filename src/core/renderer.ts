import { Line } from "../shape";
import { Edge, Shape } from "../type";
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

function renderShapes(shapes: Shape[]) {
    shapes.forEach(shape => {
        shape.draw()
    })
}

function renderEdges(edges: Edge[], ctx: any) {
    // TODO TEMP
    edges.forEach(edge => {
        const line = new Line(ctx, {
            // 锚点连接线的点位计算
            points: [
                { 
                    x: edge.source.shape.anchorList[edge.source.anchorIndex].x,
                    y: edge.source.shape.anchorList[edge.source.anchorIndex].y
                }, 
                {
                    x: edge.target.shape.anchorList[edge.target.anchorIndex].x,
                    y: edge.target.shape.anchorList[edge.target.anchorIndex].y
                }
            ]
        })
        line.draw()
    })
}

export function render(canvasMoteur: CanvasMoteur) {
    const ctx = canvasMoteur.getCtx()

    clearRect(canvasMoteur)
    renderShapes(canvasMoteur.dataCenter.data.shapes)
    renderEdges(canvasMoteur.dataCenter.data.edges, ctx)

    if (canvasMoteur.tempshape.hasEdge) {
        const line = new Line(ctx, {points: canvasMoteur.tempshape.line})
        line.draw()
    }

    canvasMoteur.dataCenter.recordData()
}