import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router';

import './assets/tailwind.css';
import 'element-plus/dist/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.config.globalProperties.url = 'https://localhost:7175/api';
app.mount('#app');
