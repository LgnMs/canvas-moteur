import * as THREE from "three";
import { Rect } from "runtime/functional/project/component/canvas/rect";
import { ComponentRender } from "./common";

export class RectRender extends ComponentRender<Rect> {
    startX: number;
    startY: number;

    constructor(component: Rect) {
        super(component);
        this.startX = this.component.position.x;
        this.startY = this.component.position.y;
    }
    getGeometry(): THREE.BufferGeometry {
        return new THREE.PlaneGeometry( this.component.style.width, this.component.style.height)
    }

    getMaterial(): THREE.Material {
        const color = new THREE.Color(this.component.style.backgroundColor);
        console.log(color, this.component.style.backgroundColor)
        return  new THREE.MeshBasicMaterial({ color })
    }

    parse(zIndex: number) {
        const geometry = this.getGeometry();
        const material = this.getMaterial();
        const object = new THREE.Mesh(geometry, material);

        object.position.x = this.startX;
        object.position.y = this.startY;
        object.position.z = zIndex;

        return object;
    }

}
