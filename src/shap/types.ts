export type ShapType =
    'rect'
    | 'circle'
    | 'line'
    | string


export interface ShapStyle {
    backgroundColor: string
}

export type anchorPosition = 'left' | 'right' | 'top' | 'bottom' 

export interface ShapBasicOptions {
    type?: ShapType
    x: number
    y: number
    style?: ShapStyle
    active?: boolean
    mousedown?: boolean
    anchors?: anchorPosition[]
    data?: any
}
