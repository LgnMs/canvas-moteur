import { generateId } from "runtime/core/common/utils";
import { View } from "runtime/functional/view";
import { Component } from "../component/common";

export interface pageOptions {
    id?: string;
    name: string;
}

export type PageEventType = 'click';
export type PageEvent = (taget: Page) => void;

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

    eventStore: Map<PageEventType, PageEvent[]> = new Map();
    
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

    public setView(view: View) {
        this.view = view;
    }

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
    
    public addEventListener(type: PageEventType, callback: (target: Page) => void) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
            events.push(callback);
            this.eventStore.set(type, events);
        } else {
            this.eventStore.set(type, [callback]);
        }
    }

    public dispatchEvent(type: PageEventType) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
    
            events.forEach(event => {
                event(this);
            })
        }
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
