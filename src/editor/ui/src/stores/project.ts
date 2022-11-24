import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Project } from 'runtime/functional/project';
import { canvasfactory, htmlfactory } from 'runtime/functional/project/component';
import { componentType, componentTag, Component } from 'runtime/functional/project/component/common';
import { Page } from 'runtime/functional/project/page';
import { ICanvasComponentOptions } from 'runtime/functional/project/component/canvas/canvasComponent';
import { IHTMLComponentOptions } from 'runtime/functional/project/component/html/htmlComponent';
import { ProjectJson } from 'runtime/functional/project/loadPorject';

export const useProjectStore = defineStore('project', () => {
    const projectInfo = ref<Project>();
    const workSpaceData = ref<ProjectJson>();
    const activePage = ref<Page | null>(null);
    const activeComponent = ref<Component>();
    const shouldRender = ref(false);
    const shouldUpdateTree = ref(false);
    // 0 表示当前选中的是页面 1表示当前选中的是组件
    const selectType = ref<0 | 1>(0);
    const container = ref<HTMLElement>();

    function setProjectInfo(data: Project) {
        projectInfo.value = data;
    }

    function addPage() {
        const pageIndex = projectInfo.value?.getAllPages().length;
        const page = Page.new({ name: `new_${pageIndex}`});
        projectInfo.value?.addPage(page);
        shouldUpdateTree.value = true;
        setActivePage(page);
        attachEventForPage(page);
    }

    function addComponent(type: componentType, tag: componentTag, options: ICanvasComponentOptions | IHTMLComponentOptions) {

        const generateComponent = () => {
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
            return com;
        }

        const com: Component | null = generateComponent();

        if (selectType.value === 0) {
            const page = activePage.value;
            if (page && com) {
                page.addComponent(com)
            }
        } else if (selectType.value === 1) {
            const component = activeComponent.value;
            if (component && com) {
                component.addComponent(com)
            }
        }
        shouldRender.value = true;
        shouldUpdateTree.value = true;

        if (com) {
            attachEventForComponent(com);
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

    let selectComponentId = '';
    function attachEventForComponent(component: Component) {
        component.addEventListener('click', (e, target) => {
            e.stopPropagation();

            if (target.type === componentType.Canvas) {
                let hasComponent = false;

                // 遍历Canvas中的子组件，如果已经有子组件被选中过了就不再执行事件
                const fn = (components: Component[]) => {
                    components.forEach(component => {
                        if (component.id === selectComponentId) {
                            hasComponent = true;
                        }

                        if (component.components.length > 0) {
                            fn(component.components);
                        }
                    })
                }
                fn(component.components);

                if (hasComponent) {
                    selectComponentId = '';
                    return;
                };
            }

            activeComponent.value = target;
            setSelectType(1);

            if (target.tag === componentTag.CANVAS) {
                selectComponentId = target.id;
            } else {
                selectComponentId = '';
            }
        })
    }

    function attachEventForPage(page: Page) {
        page.addEventListener('click', (e, target) => {
            e.stopPropagation();
            
            activePage.value = target;
            setSelectType(0);
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
        refresh,
        
    }
})
