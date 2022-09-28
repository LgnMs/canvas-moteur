import { generateId } from "runtime/core/common/utils";
import { componentClass, componentClassType } from ".";

export enum componentType {
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
    type: componentType;
    components: Component[];

    addComponent(name: string, type: componentClassType): Component;
    getAllComponents(): Component[];
}

export class Component implements IComponent {
    id: string;
    name: string;
    type: componentType;
    components: Component[] = [];
    
    constructor(name: string) {
        this.id = generateId({ suffix: '_component' });
        this.name = '';
        this.type = componentType.HTML;
    }

    static new(name: string) {
        return new Component(name);
    }

    public addComponent(name: string, type: componentClassType) {
        const component = componentClass[type].new(name);
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
    // TODO 组件管理相关功能
}

