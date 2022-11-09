<script lang="ts" setup>
import { ref } from 'vue';
import { open } from '@tauri-apps/api/dialog';
import Dialog from 'editor/ui/src/components/Dialog.vue'
import { Project } from 'runtime/functional/project';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';
import { loadPorject } from 'runtime/functional/project/loadPorject';
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
import { dirname } from '@tauri-apps/api/path';
import { isDesktop } from 'editor/common/env';

const router = useRouter()
const projectStore = useProjectStore();

const dialogState = ref(false);
const name = ref('');
const input = ref();
const loadData = ref();
const desktop = isDesktop();

function createProject() {
    const project = Project.new({name: name.value});
    projectStore.setProjectInfo(project);
    dialogState.value = false;
    router.replace('/main');
}

/**
 * @onlydesktop
 */
async function openFile() {
    if (!desktop) return;

    const path = await open({
        filters: [{
            name: 'load project',
            extensions: ['json']
        }]
    })

    if (path && !Array.isArray(path)) {
        const content = await readTextFile(path, { dir: BaseDirectory.Home })
        loadData.value = JSON.parse(content);
        const project = await loadPorject(loadData.value);
        projectStore.setProjectInfo(project);
        projectStore.setActivePage(project.getAllPages()[0]);
        router.replace('/main');
    }
}

</script>

<template>
    <div class="welcome">
        <div v-if="desktop" @click="dialogState = true">
            <button>新建项目</button>
        </div>
        <div>
            <button @click="openFile">加载项目</button>
        </div>
        <Dialog :show="dialogState">
            <div>
                <label>项目名称</label>
                <input v-model="name" />
            </div>
            <button @click="createProject">确定</button>
        </Dialog>
    </div>
</template>

<style lang="scss">
    .welcome {
        width: 100vw;
        height: 100vh;
        background-color: $basic-color;
        color: $text-color;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>