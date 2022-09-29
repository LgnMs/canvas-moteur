import { generateId } from "runtime/core/common/utils";
import { componentClassType, componentKeys, getComponentClass } from "../component";
import { Component } from "../component/common";

export class Page {
    private id: string;
    private name: string;
    private components: Component[] = [];
    
    constructor(name: string) {
        this.id = generateId({ suffix: '_page' });
        this.name = '';
    }

    static new(name: string) {
        return new Page(name);
    }
    // TODO 页面管理相关功能

    public addComponent(component: Component) {
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
}
