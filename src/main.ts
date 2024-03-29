import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import './css/common.less'
const app = createApp(App);

app.use(Antd).mount('#app', true);
