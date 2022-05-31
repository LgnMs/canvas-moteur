export interface LineOptions {x: number, y: number}

/**
 * 线的点
 */
 export interface EdgePoint {
    // TODO
    shap: any
    anchorIndex: number
}

export interface Edge {
    source: EdgePoint | null
    target: EdgePoint | null
}

export interface TempShap {
    hasEdge: boolean
    edge: Edge
    line: LineOptions[]
    setLine(line: LineOptions[]): void
    removeLine(): void
    setEdge(edge: Partial<Edge>): void
    removeEdge(): void
}

export function crateTempshap() {
    const tempShap: TempShap = {
        hasEdge: false,
        edge: {
            source: null,
            target: null
        },
        line: [],
        setLine(line) {
            tempShap.line = line
        },

        removeLine() {
            tempShap.line = []
        },
        
        setEdge(edge) {
            tempShap.hasEdge = true

            if (edge.source) {
                tempShap.edge.source = edge.source
            }
            if (edge.target) {
                tempShap.edge.target = edge.target
            }
        },
        
        removeEdge() {
            tempShap.hasEdge = false
            tempShap.edge = {
                source: null,
                target: null
            }
        }
    }

    return tempShap
}