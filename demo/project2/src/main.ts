import { createApp, App } from 'vue'
import './style.css'
import Root from './App.vue'

let app: App<Element>;
(window as any).renderProject2 = (containerId: string) => {
    app = createApp(Root)
    app.mount(containerId)
}

(window as any).unmountProject2 = () => {
    app.unmount();
}
