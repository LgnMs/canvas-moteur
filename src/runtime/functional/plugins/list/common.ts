import { generateId } from "runtime/core/common/utils";
import { PluginSystemProp } from "..";

export interface PluginOptions {
    name: string;
    description?: string;
    version?: string;
}

export abstract class Plugin {
    private readonly id: string;
    private name: string;
    private description?: string;
    private version: string = '0.0.1';

    constructor(options: PluginOptions) {
        this.id = generateId({ suffix: '_plugin'});
        this.name = options.name;
        if (options.description) {
            this.description = options.description;
        }
        if (options.version) {
            this.version = options.version;
        }
    }

    abstract run(prop: PluginSystemProp): void;
}
