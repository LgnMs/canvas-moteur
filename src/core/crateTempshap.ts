import { Edge, PartialNull } from "../type"

export interface LineOptions {x: number, y: number}

export interface TempShap {
    hasEdge: boolean
    edge: Edge | null
    line: LineOptions[]
    setLine(line: LineOptions[]): void
    removeLine(): void
    setEdge(edge: Partial<Edge>): void
    removeEdge(): void
}

export function crateTempshapApi() {
    const tempShap: TempShap = {
        hasEdge: false,
        edge: null,
        line: [],
        setLine(line) {
            tempShap.line = line
        },

        removeLine() {
            tempShap.line = []
        },
        
        setEdge(edge) {
            let edgeObj: any = {}
            if (!tempShap.hasEdge) {
                tempShap.hasEdge = true
            } else {
                edgeObj = tempShap.edge!
            }

            if (edge.source) {
                edgeObj.source = edge.source
            }
            if (edge.target) {
                edgeObj.target = edge.target
            }

            tempShap.edge = { ...tempShap.edge, ...edgeObj }
        },
        
        removeEdge() {
            tempShap.hasEdge = false
            tempShap.edge = null
        }
    }

    return tempShap
}