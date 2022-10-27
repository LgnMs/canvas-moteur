import * as THREE from 'three';
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';

export abstract class ComponentRender<T extends CanvasComponent> {
    component: T;

    constructor(component: T) {
        this.component = component;
    }
    abstract toWebAxis(layerWidth: number, layerHeight: number): this;
    abstract getGeometry(): THREE.BufferGeometry;
    abstract getMaterial(): THREE.Material;
    abstract parse(zIndex: number): THREE.Mesh;
    
    update() {
        this.component.mesh?.geometry.dispose();
        const geometry = this.getGeometry();
        this.component.mesh!.geometry = geometry;

        const color: THREE.Color = (this.component.mesh!.material as any).color;
        color.setStyle(this.component.style.backgroundColor!);
    }
    
}
