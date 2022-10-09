import * as THREE from "three";
import { Rect } from "runtime/functional/project/component/canvas/rect";
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
        const toX = (val: number) => val - (layerWidth / 2);
        const toY = (val: number) => -(val - layerHeight / 2 + (this.component.style.width! / 2));
        this.startX = toX(this.startX);
        this.startY = toY(this.startY);
        this.endX = toX(this.endX);
        this.endY = toY(this.endY);
        
        return this;
    }

    getGeometry(): THREE.BufferGeometry {
        return new THREE.BoxGeometry( this.component.style.width, this.component.style.height, 0 )
    }

    getMaterial(): THREE.Material {
        const color = new THREE.Color(this.component.style.backgroundColor);
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
