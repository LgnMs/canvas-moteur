import { Project } from "./functional/project";
import { IScriptStore } from "runtime/functional/script/defineScript";
import { Page } from "runtime/functional/project/page";
import { Component } from "runtime/functional/project/component/common";

declare global {
    interface Window {
        __GLOBAL_VAR__: {
            scriptStore: IScriptStore;
        }
    }
}

export {};
