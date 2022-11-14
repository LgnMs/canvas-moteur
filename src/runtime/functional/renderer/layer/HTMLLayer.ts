import { generateId } from "runtime/core/common/utils";
import { HTMLComponent } from "runtime/functional/project/component/html/htmlComponent";
import { parseHTML } from "../html";
import { Layer, LayerType } from "./common";

export interface HTMLLayerOptions {
    id?: string,
    style?: Partial<CSSStyleDeclaration>;
    size: {
        width: number;
        height: number;
    };
    zIndex: string;
}

export class HTMLLayer implements Layer<HTMLDivElement> {
    id: string;
    zIndex: string;
    type: LayerType;
    el: HTMLDivElement;
    components: HTMLComponent[] = [];
    width: number;
    height: number;
    style?: Partial<CSSStyleDeclaration>;

    constructor(options: HTMLLayerOptions) {
        if (options.id) {
            this.id = options.id;
        } else {
            this.id = generateId({ suffix: '_layer'});
        }
        this.type = LayerType.HTML;
        this.zIndex = options.zIndex;
        this.width = options.size.width;
        this.height = options.size.height;
        const container = document.createElement('div');
        this.el = container;

        this.style = options.style;
        this.setStyle({
            position: 'relative',
            zIndex: this.zIndex,
            left: '0px',
            top: '0px',
            width: this.width + 'px',
            height: this.height + 'px',
            ...options.style
        })
    }

    public setStyle(style: Partial<CSSStyleDeclaration>) {
        if (this.el) {
            Object.keys(style).forEach(key => {
                Reflect.set(this.el!.style, key, Reflect.get(style, key))
            })
        }
    }

    clear() {
        this.components = [];
        this.el.innerHTML = '';
        return this;
    }

    add(component: HTMLComponent) {
        this.components.push(component);
        return this;
    }

    del(component: HTMLComponent) {
        return this;
    }

    update() {
        const diffComponents: HTMLComponent[] = [];

        this.components.forEach(item => {
            if (item.shouldRender) {
                diffComponents.push(item)
            }
        })

        diffComponents.forEach(component => {
            if (component.notRendered) {
                const node = parseHTML(component);
    
                component.onCreated();
                this.el.appendChild(node);
                component.onMounted();
            } else {
                component.setStyle(component.style);
            }
        });
    }

    render() {
        this.components.forEach(component => {
            const node = parseHTML(component);

            component.onCreated();

            this.el.appendChild(node);
            component.onMounted();
        });
    }

}
