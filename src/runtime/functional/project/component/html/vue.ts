import { componentTag, componentType, createComponent } from "../common"
import { HTMLComponent, IHTMLComponentOptions } from "./htmlComponent";

/**
 * 使用UI框架vue渲染时的根元素
 */
export class VueRoot extends HTMLComponent {
    constructor(options: IHTMLComponentOptions) {
        super({
            ...options,
            type: componentType.Vue,
            tag: componentTag.HTML
        });

        this.width = options.width;
        this.height = options.height;

        this.style = {
            ...options.style
        };
    }

    public static new = createComponent<IHTMLComponentOptions, VueRoot>(VueRoot);
}

export const createVue = VueRoot.new;