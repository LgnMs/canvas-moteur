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

    toWebAxis(layerWidth: number, layerHeight: number) {
        // TODO webGL坐标转换为web坐标
        
        return this;
    }

    getGeometry(): THREE.BufferGeometry {
        return new THREE.PlaneGeometry( this.component.style.width, this.component.style.height)
    }

    getMaterial(): THREE.Material {
        const color = new THREE.Color(this.component.style.backgroundColor);
        return  new THREE.MeshBasicMaterial({ color })
    }

    update() {
        this.component.mesh?.geometry.dispose();
        const geometry = this.getGeometry();
        this.component.mesh!.geometry = geometry;

        const color: THREE.Color = (this.component.mesh!.material as any).color;
        color.setStyle(this.component.style.backgroundColor!);
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
