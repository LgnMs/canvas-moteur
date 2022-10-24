import { createRect } from './canvas/rect';
import { componentType } from './common';
import { createInput } from './html/input';

export const htmlfactory = (type: componentType) => {
    switch (type) {
        case componentType.Input:
            return createInput;
    }
}

export const canvasfactory = (type: componentType) => {
    switch (type) {
        case componentType.Rect:
            return createRect;
    }
}
