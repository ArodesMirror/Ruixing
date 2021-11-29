import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
//引入组件
import { Button, NavBar, Form, Field, Popup, Toast, Tabbar, TabbarItem, Search, Swipe, SwipeItem, Stepper, GoodsAction, GoodsActionButton, GoodsActionIcon, Empty, SwipeCell, Checkbox, CheckboxGroup, SubmitBar } from 'vant';
// 引入rem适配
import 'lib-flexible/flexible'

Vue.config.productionTip = false

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002';

// 设置Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

//注册组件
Vue.use(VueAxios, axios)
    .use(Button)
    .use(NavBar)
    .use(Form)
    .use(Field)
    .use(Popup)
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(Stepper)
    .use(GoodsAction)
    .use(GoodsActionButton)
    .use(GoodsActionIcon)
    .use(Empty)
    .use(SwipeCell)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SubmitBar)

// axios 拦截器
axios.interceptors.request.use(config => {
    // config 发起请求的配置信息
    // console.log('config==>', config);
    // 处理post请求参数，进行参数序列化
    if (config.method === 'post') {
        var paramsString = "";
        for (let key in config.data) {
            paramsString += `${key}=${config.data[key]}&`
        }
        config.data = paramsString.slice(0, -1);
    }
    // 必须返回config，结束拦截，进行下一步
    return config;
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')