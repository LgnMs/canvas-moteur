import { Edge } from "../type"

export interface LineOptions {x: number, y: number}

export interface Tempshape {
    hasEdge: boolean
    edge: Edge | null
    line: LineOptions[]
    setLine(line: LineOptions[]): void
    removeLine(): void
    setEdge(edge: Partial<Edge>): void
    removeEdge(): void
}

export function crateTempshapeApi() {
    const tempshape: Tempshape = {
        hasEdge: false,
        edge: null,
        line: [],
        setLine(line) {
            tempshape.line = line
        },

        removeLine() {
            tempshape.line = []
        },
        
        setEdge(edge) {
            let edgeObj: any = {}
            if (!tempshape.hasEdge) {
                tempshape.hasEdge = true
            } else {
                edgeObj = tempshape.edge!
            }

            if (edge.source) {
                edgeObj.source = edge.source
            }
            if (edge.target) {
                edgeObj.target = edge.target
            }

            tempshape.edge = { ...tempshape.edge, ...edgeObj }
        },
        
        removeEdge() {
            tempshape.hasEdge = false
            tempshape.edge = null
        }
    }

    return tempshape
}