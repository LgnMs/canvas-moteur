import { Component } from "runtime/functional/component/common";

export interface CanvasRender {
    getGeometry(rect: Component): THREE.BufferGeometry;
    getMaterial(rect: Component): THREE.Material;
    parse(rect: Component): THREE.Mesh;
}
