import { createApp } from "vue";
import 'normalize.css'
import './assets/init.css'
import { createPinia } from 'pinia';
import App from "./App.vue";
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount("#app");
