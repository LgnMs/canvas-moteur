import * as THREE from "three";
import { Rect } from "runtime/functional/component/canvas/rect";
import { ComponentRender } from "./common";

export class RectRender extends ComponentRender<Rect> {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor(component: Rect) {
        super(component);
        this.startX = this.component.position.x;
        this.startY = this.component.position.y;
        this.endX = this.component.position.x + this.component.style.width!;
        this.endY = this.component.position.y + this.component.style.height!;
    }

    toWebAxis(layerWidth: number, layerHeight: number) {
        const toX = (val: number) => val - layerWidth / 2;
        const toY = (val: number) => -(val - layerHeight / 2);
        this.startX = toX(this.component.position.x);
        this.startY = toY(this.component.position.y);
        this.endX = toX(this.component.position.x + this.component.style.height!);
        this.endY = toY(this.component.position.y + this.component.style.height!);
        return this;
    }

    getGeometry(): THREE.BufferGeometry {
        const { startX, startY, endX, endY } = this;
        const Shape = new THREE.Shape();

        Shape.moveTo(startX, startY);
        Shape.lineTo(endX, startY);
        Shape.lineTo(endX, endY);
        Shape.lineTo(startX, endY);

        return new THREE.ShapeGeometry(Shape);
    }

    getMaterial(): THREE.Material {
        const color = new THREE.Color(this.component.style.backgroundColor);
        return  new THREE.MeshBasicMaterial({ color })
    }

    parse() {
        const geometry = this.getGeometry();
        const material = this.getMaterial();
        return new THREE.Mesh(geometry, material)
    }

}
