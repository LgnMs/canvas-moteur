import * as THREE from "three";
import { BufferGeometry, Color, Material, Mesh } from "three";
import { Rect } from "runtime/functional/component/canvas/rect";
import { CanvasRender } from "./common";

type toWebAxis = (number: number) => number;

export class RectRender implements CanvasRender {
    toWebxAxis: toWebAxis;
    toWebyAxis: toWebAxis;

    constructor(toWebxAxis: toWebAxis, toWebyAxis: toWebAxis) {
        this.toWebxAxis = toWebxAxis;
        this.toWebyAxis = toWebyAxis;
    }

    getGeometry(rect: Rect): BufferGeometry {
        const Shape = new THREE.Shape();

        const startX = this.toWebxAxis(rect.style.x);
        const startY = this.toWebyAxis(rect.style.y);
        const endX = this.toWebxAxis(rect.style.x + rect.style.width);
        const endY = this.toWebyAxis(rect.style.y + rect.style.height);

        Shape.moveTo(startX, startY);
        Shape.lineTo(endX, startY);
        Shape.lineTo(endX, endY);
        Shape.lineTo(startX, endY);

        return new THREE.ShapeGeometry(Shape);
    }
    getMaterial(rect: Rect): Material {
        const color = new THREE.Color(rect.style.backgroundColor);
        return  new THREE.MeshBasicMaterial( { color } )
    }

    parse(rect: Rect) {
        const geometry = this.getGeometry(rect);
        const material = this.getMaterial(rect);
        return new THREE.Mesh(geometry, material)
    }

}