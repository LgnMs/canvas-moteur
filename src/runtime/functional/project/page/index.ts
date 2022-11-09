import { generateId } from "runtime/core/common/utils";
import { Component } from "../component/common";

export interface pageOptions {
    id?: string;
    name: string;
}

export class Page {
    [key: string]: any;
    id: string;
    name: string;
    width: string = '1110px';
    height: string = 'auto';
    components: Component[] = [];

    onCreated = () => {};
    onMounted = () => {};
    onUnMounted = () => {};
    
    constructor(options: pageOptions) {
        if (options.id) {
            this.id = options.id;
        } else {
            this.id = generateId({ suffix: '_page' });
        }
        this.name = options.name;
    }

    static new(options: pageOptions) {
        const target = new Page(options);

        return new Proxy(target, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver)
            }
        });
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
