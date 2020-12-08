// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Es6Promise from 'es6-promise'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import './assets/css/reset.css'
import './assets/js/rem' // rem布局
import './assets/iconfont/iconfont.css'

Es6Promise.polyfill()

import 'element-ui/lib/theme-chalk/index.css'; 
import element from './element/index'
Vue.use(element)
import 'vant/lib/index.css';
import vant from './vant/index'
Vue.use(vant) 
/* import VConsole from 'vconsole'
let vConsole = new VConsole()
Vue.use(vConsole) */


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
