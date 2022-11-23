import * as THREE from 'three';
import { CanvasComponent } from 'runtime/functional/project/component/canvas/canvasComponent';

export abstract class ComponentRender<T extends CanvasComponent> {
    component: T;

    constructor(component: T) {
        this.component = component;
    }
    abstract getGeometry(): THREE.BufferGeometry;
    abstract getMaterial(): THREE.Material;
    abstract parse(zIndex: number): THREE.Mesh;
    
    update() {
        // Disposes the object from memory. You need to call this when you want the bufferGeometry removed while the application is running.
        this.component.mesh?.geometry.dispose();

        const geometry = this.getGeometry();
        this.component.mesh!.geometry = geometry;

        const color: THREE.Color = (this.component.mesh!.material as any).color;
        color.setStyle(this.component.style.backgroundColor!);
    }
    
}
