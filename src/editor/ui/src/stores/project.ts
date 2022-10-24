import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Project } from 'runtime/functional/project';
import { canvasfactory, htmlfactory } from 'runtime/functional/project/component';
import { componentType, componentTag, Component } from 'runtime/functional/project/component/common';
import { Page } from 'runtime/functional/project/page';
import { ICanvasComponentOptions } from 'runtime/functional/project/component/canvas/canvasComponent';
import { IHTMLComponentOptions } from 'runtime/functional/project/component/html/htmlComponent';
import { PageRenderer } from 'runtime/functional/renderer/pageRenderer';
import { render as viewrender } from 'runtime/functional/renderer';
import { error } from 'runtime/core/log';

export const useProjectStore = defineStore('project', () => {
    const projectInfo = ref<Project>();
    const changeTime = ref(0);
    const activePage = ref<Page>();
    const shouldRender = ref(false);
    const renderer = ref<PageRenderer>();

    function setProjectInfo(data: Project) {
        projectInfo.value = data;
        changeTime.value += 1;
    }

    function addPage() {
        const pageIndex = projectInfo.value?.getAllPages().length;
        const page = Page.new({ name: `new_${pageIndex}` });
        projectInfo.value?.addPage(page);
        changeTime.value += 1;
        activePage.value = page;
    }

    function addComponent(type: componentType, tag: componentTag, options: ICanvasComponentOptions | IHTMLComponentOptions) {
        const page = activePage.value;
        if (page) {
            let com: Component | null = null;

            if (tag === componentTag.HTML) {
                const fn = htmlfactory(type);
                if (fn) {
                    com = fn(options as IHTMLComponentOptions);
                }
            }
            if (tag === componentTag.CANVAS) {
                const fn = canvasfactory(type);
                if (fn) {
                    com = fn(options as ICanvasComponentOptions);
                }
            }
            
            if (com) {
                page.addComponent(com)
                changeTime.value += 1;
                shouldRender.value = true;
            }
        }
    }

    function isEmpty() {
        return projectInfo.value === undefined;
    }

    function changePageNameById(id: string, name: string) {
        projectInfo.value?.pages.forEach(item => {
            if (item.id === id) {
                item.name = name
            }
        })
    }

    function getActivePage() {
        return activePage.value!;
    }

    function render(container: HTMLElement) {
        if (activePage.value) {
            if (renderer.value) {
                renderer.value.render(activePage.value);
            } else {
                renderer.value = viewrender(activePage.value, container)
            }
            shouldRender.value = false;
        } else {
            error('没有激活的页面')
        }
    }

    return {
        changeTime,
        projectInfo,
        activePage,
        shouldRender,
        setProjectInfo,
        addPage,
        addComponent,
        isEmpty,
        changePageNameById,
        getActivePage,
        render,
    }
})