import { BasicShape } from "./shape/basicShape"

/**
 * 线的点
 */
interface EdgePoint {
    shape: Shape
    anchorIndex: number
}

interface Edge {
    source: EdgePoint
    target: EdgePoint
}

interface Shape extends BasicShape {
}


type PartialNull<T> = {
    [P in keyof T]: T[P] | null;
}