import * as THREE from 'three';
import { Component } from "runtime/functional/component/common";
import { Rect } from '../component/canvas/rect';
import { RectRender } from './canvas/rect';

type toWebAxis = (number: number) => number;


export function renderCanvas(component: Component, scene: THREE.Scene, toWebxAxis: toWebAxis, toWebyAxis: toWebAxis) {
    if (component.type === 'rect') {
        const rectRender = new RectRender(toWebxAxis, toWebyAxis);
        scene.add(rectRender.parse(component as Rect));
    }
}

export function parseHTML(component: Component) {
    const node = document.createElement(component.type);
    // TODO 添加属性、样式

    return node;
}