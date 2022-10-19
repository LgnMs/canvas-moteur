<script lang="ts" setup>
import { ref } from 'vue';
import Dialog from 'ui/src/components/cm-dialog.vue'
import { Project } from 'runtime/functional/project';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';

const router = useRouter()
const projectStore = useProjectStore();

const dialogState = ref(false);
const name = ref('');

function createProject() {
    const project = Project.new(name.value);
    projectStore.setProjectInfo(project);
    dialogState.value = false;
    router.replace('/main');
}

</script>

<template>
    <div class="welcome">
        <div @click="dialogState = true">
            <span>新建项目</span>
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>