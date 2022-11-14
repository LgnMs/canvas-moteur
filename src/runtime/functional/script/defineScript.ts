import { Project } from "runtime/functional/project";
import { Component } from "runtime/functional/project/component/common";
import { Page } from "runtime/functional/project/page";

export interface Script {
    [key: string]: any;

    onMounted?(): void;

    onUnMounted?(): void;
}

export type ScriptSelfType = Project | Component | Page;


export type ScriptFn<T> = (self: T) => Script;

type ReturnScriptType<T> = T extends ScriptSelfType ? ScriptFn<T> : never;

export interface IScriptStore {
    [key: string]: ReturnScriptType<ScriptSelfType>;
}

export function defineScript(fn: ReturnScriptType<ScriptSelfType>, componentId: string) {
    window.__GLOBAL_VAR__.scriptStore[componentId] = fn;
}

export function defineProjectScript(fn: ReturnScriptType<Project>, id: string) {
    defineScript(fn, id);
}

export function definePageScript(fn: ReturnScriptType<Page>, id: string) {
    defineScript(fn, id);
}

export function defineComponentScript(fn: ReturnScriptType<Component>, id: string) {
    defineScript(fn, id);
}