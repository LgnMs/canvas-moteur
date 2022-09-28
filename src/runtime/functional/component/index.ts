import { generateId } from "runtime/core/common/utils";

export class Component {
    private id: string;
    private name: string;
    private components: Component[] = [];
    
    constructor(name: string) {
        this.id = generateId({ suffix: '_component' });
        this.name = '';
    }

    static new(name: string) {
        return new Component(name);
    }

    public addComponent(name: string) {
        const component = Component.new(name);
        this.components.push(component);
        return component;
    }
    
    public getAllComponents() {
        return this.components;
    }
    // TODO 组件管理相关功能
}