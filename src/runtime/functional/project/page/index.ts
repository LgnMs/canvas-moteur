import { generateId } from "runtime/core/common/utils";
import { Component } from "../component/common";

export interface pageOptions {
    name: string;
}

export class Page {
    [key: string]: any;
    id: string;
    name: string;
    components: Component[] = [];

    onCreated = () => {};
    onMounted = () => {};
    onUnMounted = () => {};
    
    constructor(options: pageOptions) {
        this.id = generateId({ suffix: '_page' });
        this.name = options.name;
    }

    static new(options: pageOptions) {
        const target = new Page(options);

        return new Proxy(target, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                if (prop === 'setup') {
                    target.injectScript(value);
                }
                return Reflect.set(target, prop, value, receiver)
            }
        });
    }

    public injectScript(setup: () => object) {
        const obj = setup();
        Object.keys(obj).forEach(key => Reflect.set(this, key, Reflect.get(obj, key)));
    }
    // TODO 页面管理相关功能

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
    
    /**
     *  重置该页面的渲染状态，用于页面切换后使用
     */
    public pageShouldRender() {
        const fn = (components: Component[]) => {
            components.forEach(component => {
                component.setShouldRender(true);
                component.setNotRendered(true);
                if (component.components.length > 0) {
                    fn(component.components);
                }
            })
        }
        
        fn(this.components);
    }
}
