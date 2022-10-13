import { generateId } from "runtime/core/common/utils";
import { Script, ScriptData, ScriptLifeCycle } from "runtime/functional/script";
import { Component } from "../component/common";

export interface pageOptions {
    name: string;
}

export class Page {
    [key: string]: any;
    private id: string;
    private name: string;
    private components: Component[] = [];

    public data: ScriptData = {};
    onCreated: ScriptLifeCycle = () => {};
    onMounted: ScriptLifeCycle = () => {};
    onUpdate: ScriptLifeCycle = () => {};
    onUnmounted: ScriptLifeCycle = () => {};
    
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
                if (prop === 'setup') {
                    target.injectScript(value);
                }
                return Reflect.set(target, prop, value, receiver)
            }
        });
    }

    private injectScript(setup: () => object) {
        const obj = setup();
        Object.keys(obj).forEach(key => Reflect.set(this, key, Reflect.get(obj, key)));
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
