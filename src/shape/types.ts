export type shapeType =
    'rect'
    | 'circle'
    | 'line'
    | 'polyline'
    | string


export interface shapeStyle {
    backgroundColor: string
}

export type anchorPosition = 'left' | 'right' | 'top' | 'bottom' 

export interface shapeBasicOptions {
    type?: shapeType
    x: number
    y: number
    style?: shapeStyle
    active?: boolean
    mousedown?: boolean
    anchors?: anchorPosition[]
    data?: any
}
