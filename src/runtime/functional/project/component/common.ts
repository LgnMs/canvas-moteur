import { generateId } from "runtime/core/common/utils";
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
    name: string;
    type: componentType;
    tag: componentTag;
} 

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
    
    constructor({ name, type, tag }: COptions) {
        this.id = generateId({ suffix: '_component' });
        this.name = name;
        this.type = type;
        this.tag = tag;
    }

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
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
                if (prop === 'setup') {
                    target.injectScript(value);
                }
                return Reflect.set(target, prop, value, receiver)
            }
        });
    }
}