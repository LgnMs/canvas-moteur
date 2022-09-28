import { Rect } from './canvas/rect';

import { Input } from './html/input';

export const componentClass = {
    Rect,
    Input
}

export type componentClassType = keyof(typeof componentClass);