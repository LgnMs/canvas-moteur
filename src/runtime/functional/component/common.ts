import { generateId } from "runtime/core/common/utils";

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

export interface IComponent {
    id: string;
    name: string;
    type: string;
    tag: componentTag;
    components: Component[];

    addComponent(components: Component): Component;
    getAllComponents(): Component[];
}

export abstract class Component implements IComponent {
    id: string;
    name: string;
    type: string;
    tag: componentTag;
    components: Component[] = [];
    
    constructor(name: string, type: string, tag: componentTag) {
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
    // TODO 组件管理相关功能
}

