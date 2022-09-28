import { generateId } from "runtime/core/common/utils";
import { Component } from "runtime/functional/component";

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

    public addComponent(name: string) {
        const component = Component.new(name);
        this.components.push(component);
        return component;
    }

    public getAllComponents() {
        return this.components;
    }
}