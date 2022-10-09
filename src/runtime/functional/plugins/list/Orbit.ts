import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { error } from "runtime/core/log";
import { PluginSystemProp } from "..";
import { PluginOptions, Plugin } from "./common";

export class Orbit extends Plugin {
    
    constructor(options: PluginOptions) {
        super(options);
    }

    static new(options: PluginOptions) {
        return new Orbit(options);
    }

    public run(prop: PluginSystemProp) {
        if (!prop.pageRenderer) return error('插件系统未初始化');
        // 实现canvas的拖拽
        const canvasLayer = prop.pageRenderer.getCanvasLayer();
        const controls = new OrbitControls(canvasLayer.renderer.camera, canvasLayer.renderer.renderer.domElement);
        controls.update();

        function animate() {
            requestAnimationFrame( animate );
            // required if controls.enableDamping or controls.autoRotate are set to true
            controls.update();
            canvasLayer.render();
        
        }
        animate();
    }
}