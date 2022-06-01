import { BasicShape } from "./shap/basicShap"

/**
 * 线的点
 */
interface EdgePoint {
    shap: Shap
    anchorIndex: number
}

interface Edge {
    source: EdgePoint
    target: EdgePoint
}

interface Shap extends BasicShape {
}


type PartialNull<T> = {
    [P in keyof T]: T[P] | null;
}