import { generateId } from "runtime/core/common/utils";
import { Component } from "../component/common";

export interface pageOptions {
    name: string;
}

export class Page {
    private id: string;
    private name: string;
    private components: Component[] = [];
    
    constructor(options: pageOptions) {
        this.id = generateId({ suffix: '_page' });
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
}
