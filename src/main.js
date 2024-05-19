import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'

// 导入 ElementPlus 组件
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 导入路由
import router from "./router/router.js";
// 导入样式
import 'element-plus/dist/index.css'
// 导入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入登录组件
import LoginView from './view/LoginView.vue'

let app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, {locale: zhCn}).use(router).mount('#app')
