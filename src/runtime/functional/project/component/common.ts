import { generateId } from "runtime/core/common/utils";
import { getParseScript } from "runtime/functional/script";
import { ComponentStyle } from "./style";

export enum componentTag {
    /**
     * 包含HTML、canvas的混合组件
     */
    MIX_COMPONENT,
    /**
     * 纯HTML组件
     */
    HTML,
    /**
     * 纯canvas组件
     */
    CANVAS,
    /**
     * 由基础组件组合成的一种组件
     */
    GROUP_COMPONENT,
}

export enum componentType {
    Rect = 'Rect',
    Input = 'Input'
}

export interface IComponent {
    [key: string]: any;

    id: string;
    name: string;
    type: componentType;
    tag: componentTag;
    components: Component[];
    position: {
        x: number;
        y: number;
    };
    eventStore: Map<ComponentEventType, ComponentEvent[]>;
    shouldRender: boolean;
    style?: object;

    onCreated: () => void;
    onMounted: () => void;
    onUnMounted: () => void;

    addComponent(components: Component): Component;
    getAllComponents(): Component[];
}

export interface IComponentOptions {
    position?: {
        x: number;
        y: number;
    },
    name: string;
    style?: ComponentStyle | CSSStyleDeclaration;
}

export interface COptions {
    id?: string;
    name: string;
    type: componentType;
    tag: componentTag;
    script?: {
        type: string;
        path: string;
    }
} 

export type ComponentEventType = 'click';
export type ComponentEvent = (taget: Component) => void;

export abstract class Component implements IComponent {
    [key: string]: any;

    id: string;
    name: string;
    type: componentType;
    tag: componentTag;
    components: Component[] = [];
    position!: {
        x: number;
        y: number;
    };

    onCreated = () => {};
    onMounted = () => {};
    onUnMounted = () => {};

    eventStore: Map<ComponentEventType, ComponentEvent[]> = new Map();

    /**
     * 1.该组件是新添加的
     * 2.该组件的属性发生过变动
     * 3.该组件需要被重新渲染
     * 第一次初始化的组件都是需要被渲染的
     */ 
    shouldRender: boolean = true;
    /**
     * 该组件还没有在layer中渲染过
     */ 
    notRendered: boolean = true;
    
    constructor(options: COptions) {
        const { name, type, tag, script } = options;
        if (options.id) {
            this.id = options.id;
        } else {
            this.id = generateId({ suffix: '_component' });
        }
        this.name = name;
        this.type = type;
        this.tag = tag;
        this.script = script;
    }

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
    }

    public setShouldRender(state: boolean) {
        this.shouldRender = state;
    }

    public setNotRendered(state: boolean) {
        this.notRendered = state;
    }

    public getAllComponents() {
        return this.components;
    }

    public setPosition(x: number, y: number) {
        this.position = { x, y };
    }

    public injectScript(setup: () => object) {
        const obj = setup();
        Object.keys(obj).forEach(key => Reflect.set(this, key, Reflect.get(obj, key)));
    }

    public addEventListener(type: ComponentEventType, callback: (target: Component) => void) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
            events.push(callback);
            this.eventStore.set(type, events);
        } else {
            this.eventStore.set(type, [callback]);
        }
    }

    public dispatchEvent(type: ComponentEventType) {
        if (this.eventStore.has(type)) {
            const events = this.eventStore.get(type)!;
    
            events.forEach(event => {
                event(this);
            })
        }
    }
    // TODO 组件管理相关功能
}

export function createComponent<T, C extends Component>(Component: new (options: T) => C) {
    return (options: T) => {
        const target = new Component(options);
        return new Proxy(target, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver)
            }
        });
    }
}