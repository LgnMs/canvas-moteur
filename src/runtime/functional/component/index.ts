import { Rect } from './canvas/rect';
import { Input } from './html/input';

export const componentClass = {
    Rect,
    Input
}

export type componentKeys = keyof(typeof componentClass);

export function getComponentClass(type: componentKeys) {
    return componentClass[type];
}

export type componentClassType = Rect | Input;