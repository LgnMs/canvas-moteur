import { componentTag } from '../common';
import { getComponentClass } from '../index'

test('初始化组件', () => {
    const Rect = getComponentClass('Rect');
    const Input = getComponentClass('Input');

    expect(new Rect({name: 'rect'}).tag).toEqual(componentTag.CANVAS);
    expect(new Input({name: 'input'}).tag).toEqual(componentTag.HTML);
})