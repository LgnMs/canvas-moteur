import { createRouter, createWebHashHistory } from 'vue-router';

import Welcome from './views/welcome/index.vue'
import Main from './views/main/main.vue'

const routes = [
    { path: '/', redirect: 'main' },
    { path: '/welcome', component: Welcome },
    { path: '/main', component: Main },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;
