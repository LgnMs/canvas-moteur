import { error } from 'runtime/core/log';
import { createRect } from './canvas/rect';
import { componentTag, componentType } from './common';
import { createInput } from './html/input';
import { createGrid } from './html/grid';

export const htmlfactory = (type: componentType) => {
    switch (type) {
        case componentType.Input:
            return createInput;
        case componentType.Grid:
            return createGrid;
        default:
            error('未找到相关的方法')
    }
}

export const canvasfactory = (type: componentType) => {
    switch (type) {
        case componentType.Rect:
            return createRect;
        default:
            error('未找到相关的方法')
    }
}

export const componentfactory = (tag: componentTag, type: componentType) => {
    if (tag === componentTag.CANVAS) {
        return canvasfactory(type);
    } else if (tag === componentTag.HTML) {
        return htmlfactory(type);
    } else {
        error('未找到相关的方法')
    }
}