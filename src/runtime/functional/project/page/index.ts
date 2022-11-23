import { generateId } from "runtime/core/common/utils";
import { Component } from "../component/common";

export interface pageOptions {
    id?: string;
    name: string;
    style?: Partial<CSSStyleDeclaration>;
}

export type PageEventType = 'click';
export type PageEvent = (e: Event, taget: Page) => void;

export class Page {
    [key: string]: any;
    id: string;
    name: string;
    width: string = '1110px';
    height: string = 'auto';
    components: Component[] = [];
    style: Partial<CSSStyleDeclaration>;

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
        this.style = {
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: '',
            gridAutoRows: '',
            gridTemplateAreas: '',
            ...options.style
        };
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

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
    
    public addEventListener(type: PageEventType, callback: (e: Event, target: Page) => void) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
            events.push(callback);
            this.eventStore.set(type, events);
        } else {
            this.eventStore.set(type, [callback]);
        }
    }

    public dispatchEvent(type: PageEventType, e: Event) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
    
            events.forEach(event => {
                event(e, this);
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
