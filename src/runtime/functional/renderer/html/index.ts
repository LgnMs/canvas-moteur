import { Component } from "runtime/functional/component/common";

export function parseHTML(component: Component) {
    const node = document.createElement(component.type);
    // TODO 添加属性、样式

    return node;
}