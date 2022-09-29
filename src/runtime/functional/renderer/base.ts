import { Component } from "runtime/functional/component/common";

// export interface Renderer {
//     render(): Renderer;
//     update(): void;
// }

// export class CanvasRenderer implements Renderer {
//     render(): Renderer {
//         return this;
//     };
//     update(): void {
        
//     };
// }

// export class HTMLRenderer implements Renderer {
//     render(): Renderer {
//         return this;
//     };
//     update(): void {
        
//     };
// }

export function parseCanvas(component: Component) {

}

export function parseHTML(component: Component) {
    const node = document.createElement(component.type);
    // TODO 添加属性、样式

    return node;
}