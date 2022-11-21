import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Project } from 'runtime/functional/project';
import { canvasfactory, htmlfactory } from 'runtime/functional/project/component';
import { componentType, componentTag, Component } from 'runtime/functional/project/component/common';
import { Page } from 'runtime/functional/project/page';
import { ICanvasComponentOptions } from 'runtime/functional/project/component/canvas/canvasComponent';
import { IHTMLComponentOptions } from 'runtime/functional/project/component/html/htmlComponent';
import { PageRenderer } from 'runtime/functional/renderer/pageRenderer';
import { initPageRenderer } from 'runtime/functional/renderer';
import { error, log } from 'runtime/core/log';
import { ProjectJson } from 'runtime/functional/project/loadPorject';

export const useProjectStore = defineStore('project', () => {
    const projectInfo = ref<Project>();
    const workSpaceData = ref<ProjectJson>();
    const activePage = ref<Page | null>();
    const activeComponent = ref<Component>();
    const shouldRender = ref(false);
    const shouldUpdateTree = ref(false);
    // 0 表示当前选中的是页面 1表示当前选中的是组件
    const selectType = ref(0);
    let pageRenderer: PageRenderer | null = null;
    const container = ref<HTMLElement>();

    function setProjectInfo(data: Project) {
        projectInfo.value = data;
    }

    function addPage() {
        const pageIndex = projectInfo.value?.getAllPages().length;
        const page = Page.new({ name: `new_${pageIndex}`});
        projectInfo.value?.addPage(page);
        setActivePage(page)
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
                shouldRender.value = true;
                shouldUpdateTree.value = true;
                attachEventForComponent(com);
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

    function setActivePage(data: Page) {
        activePage.value = data;
        activePage.value.pageShouldRender();
    }

    function setActiveComponent(data: Component) {
        activeComponent.value = data;
    }

    function attachEventForComponent(component: Component) {
        component.addEventListener('click', target => {
            activeComponent.value = target;
            setSelectType(1);
        })
    }

    /**
     * 0 表示当前选中的是页面 1表示当前选中的是组件
     * @param type 
     */
    function setSelectType(type: 0 | 1) {
        selectType.value = type;
    }

    function setContainer(el: HTMLElement) {
        container.value = el
    }

    function setWorkSpaceData(data: ProjectJson) {
        workSpaceData.value = data
    }

    function setShouldUpdateTree(data: boolean) {
        shouldUpdateTree.value = data
    }

    function setShouldRender(data: boolean) {
        shouldRender.value = data
    }

    function clear() {
        // 清空当前页面的渲染器，但并不包括元素节点中的内容
        if (pageRenderer) {
            pageRenderer.clear();
            pageRenderer = null;
        }
    }


    function refresh() {
        // 重置之后窗口界面会监听到然后重新渲染页面
        const page = activePage.value;
        if (page) {
            activePage.value = null;
            setTimeout(() => {
                setActivePage(page);
            }, 0)
        }
    }

    function render(container?: HTMLElement) {
        if (activePage.value) {
            if (pageRenderer) {
                pageRenderer.update(activePage.value);
            } else {
                if (container) {
                    pageRenderer = initPageRenderer(activePage.value, container)
                    pageRenderer.render();
    
                    activePage.value.components.forEach(component => {
                        attachEventForComponent(component);
                    })
                }
            }

            
            shouldRender.value = false;
        } else {
            error('没有激活的页面')
        }
    }

    return {
        projectInfo,
        activePage,
        activeComponent,
        shouldRender,
        selectType,
        shouldUpdateTree,
        setProjectInfo,
        addPage,
        addComponent,
        isEmpty,
        changePageNameById,
        getActivePage,
        setActiveComponent,
        setActivePage,
        setSelectType,
        setContainer,
        setWorkSpaceData,
        setShouldUpdateTree,
        setShouldRender,
        render,
        clear,
        refresh,
        
    }
})
