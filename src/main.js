// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import './assets/css/reset.css'
import './assets/js/rem' // rem布局
import './assets/iconfont/iconfont.css'
import Vant from 'vant';
import 'vant/lib/index.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 

/* import VConsole from 'vconsole'
let vConsole = new VConsole()
Vue.use(vConsole) */


Vue.use(ElementUI);
Vue.use(Vant);

Vue.use(api)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
