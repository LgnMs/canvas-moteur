import { generateId } from "runtime/core/common/utils";
import { Component } from "../component/common";

export class Page {
    private id: string;
    private name: string;
    private components: Component[] = [];
    private size: {width: number, height: number};
    
    constructor(name: string) {
        this.id = generateId({ suffix: '_page' });
        this.name = '';
        this.size = {
            width: 500,
            height: 500
        }
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

    public getSize() {
        return this.size;
    }

    public setSize(width: number, height: number) {
        this.size = { width, height };
    }
}
