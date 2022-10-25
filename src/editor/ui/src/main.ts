import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'normalize.css';

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
