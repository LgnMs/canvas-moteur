import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defineGlobalVar } from 'runtime/core/global'
import router from './router'
import App from './App.vue'

import 'normalize.css';

defineGlobalVar();

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');
