import { Component } from "runtime/functional/project/component/common";

export enum LayerType {
    Canvas,
    HTML
};

export interface Layer<T extends HTMLElement> {
    id: string;
    zIndex: string
    type: LayerType;
    el: T;
    components: Component[];
    width: number;
    height: number;
    style?: Partial<CSSStyleDeclaration>;

    clear(): Layer<T>;

    /**
     * 向Layer中添加元素
     */
    add(component: Component): Layer<T>;

    /**
     * 删除Layer中添加元素
     */
    del(component: Component): Layer<T>;

    /**
     * 更新Layer中添加元素
     */
    update(): void;

    /**
     * 渲染Layer
     */
    render(): void;
}