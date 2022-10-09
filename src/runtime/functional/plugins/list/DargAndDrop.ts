import { error } from 'runtime/core/log';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { PluginSystemProp } from "..";
import { PluginOptions, Plugin } from "./common";

interface DargAndDropOptions extends PluginOptions {
}
/**
 * 为组件添加拖拽功能
 */
export class DargAndDrop extends Plugin {
    
    constructor(options: DargAndDropOptions) {
        super(options);
    }

    static new(options: DargAndDropOptions) {
        return new DargAndDrop(options);
    }

    public run(prop: PluginSystemProp) {
        if (!prop.pageRenderer) return error('插件系统未初始化');
        // 实现canvas的拖拽
        const canvasLayer = prop.pageRenderer.getCanvasLayer();

        const controls = new DragControls(canvasLayer.renderer.objects, canvasLayer.renderer.camera, canvasLayer.renderer.renderer.domElement);
        // add event listener to highlight dragged objects

        controls.addEventListener('dragstart', e => {
            console.log(e)
        });

        controls.addEventListener('drag', e => {
            canvasLayer.renderer.render();
        });

        controls.addEventListener('dragend', e => {
        });
    }
}
