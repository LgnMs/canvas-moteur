import { Plugin } from "./list/common";

export interface PluginSystemProp {
}

export class PluginSystem {
    private static plugins: Set<Plugin> = new Set();
    private static prop: PluginSystemProp;
    
    static init(prop: PluginSystemProp) {
        this.prop = prop;
        return this;
    }

    static installPlugins(plugins: Plugin[]) {
        plugins.forEach(plugin => {
            this.plugins.add(plugin);
        })
        return this;
    }

    public static install(plugin: Plugin) {
        this.plugins.add(plugin);
        return this;
    }

    public static uninstall(plugin: Plugin) {
        this.plugins.delete(plugin);
        return this;
    }

    public static getPlugins() {
        return this.plugins;
    }

    public static run() {
        for (const plugin of this.plugins) {
            plugin.run(this.prop);
        }
        return this;
    }
}
