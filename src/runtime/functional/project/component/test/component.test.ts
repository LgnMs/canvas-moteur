import { createRect } from '../canvas/rect';
import { componentTag } from '../common';
import { createInput } from '../html/input';

test('初始化组件', () => {
    expect(createRect({name: 'rect', layerId: ''}).tag).toEqual(componentTag.CANVAS);
    expect(createInput({name: 'input', layerId: ''}).tag).toEqual(componentTag.HTML);
})