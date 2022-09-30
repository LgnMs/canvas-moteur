import * as THREE from 'three';

export abstract class ComponentRender<T> {
    component: T;

    constructor(component: T) {
        this.component = component;
    }
    abstract toWebAxis(layerWidth: number, layerHeight: number): this;
    abstract getGeometry(): THREE.BufferGeometry;
    abstract getMaterial(): THREE.Material;
    abstract parse(): THREE.Mesh;
}
