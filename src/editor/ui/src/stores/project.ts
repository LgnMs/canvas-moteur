import { defineStore } from 'pinia'
import { Project } from 'runtime/functional/project';
import { componentClass } from 'runtime/functional/project/component';
import { componentType } from 'runtime/functional/project/component/common';
import { Page } from 'runtime/functional/project/page';
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
    const projectInfo = ref<Project>();
    const changeTime = ref(0);

    function setProjectInfo(data: Project) {
        projectInfo.value = data;
        changeTime.value += 1;
    }

    function addPage() {
        const pageIndex = projectInfo.value?.getAllPages().length;
        const page = Page.new({ name: `new_${pageIndex}` });
        projectInfo.value?.addPage(page);
        changeTime.value += 1;
    }

    function addComponent(page: Page, name: string, type: componentType) {
        const com = componentClass[type].new({ name })
        page.addComponent(com)
        changeTime.value += 1;
    }

    function isEmpty() {
        return projectInfo.value === undefined;
    }

    return {
        changeTime,
        projectInfo,
        setProjectInfo,
        addPage,
        addComponent,
        isEmpty
    }
})
