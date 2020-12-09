import Vue from "vue";
import Router from "vue-router";
import {GetQueryByString} from '@/utils'
import config from "@/api/config";

//管理员路径
const Login = () => import("@/views/admin/Login") 
const Index = () => import("@/views/admin/Index") 
const DeviceManage = () => import("@/views/admin/DeviceManage") 
const CarManage = () => import("@/views/admin/CarManage") 
const PresentCar = () => import("@/views/admin/PresentCar") 
const DetentionInventory = () => import("@/views/admin/DetentionInventory") 
const Blacklist = () => import("@/views/admin/Blacklist") 
const Blankpage = () => import("@/views/admin/Blankpage") 
const Statistical = () => import("@/views/admin/Statistical") 
const addCar = () => import("@/components/admin/addCar") 
const Loading = () => import("@/views/admin/Loading")
const Order = () => import("@/views/admin/Order") 
//商户路径
const LoadingShop = () => import("@/views/business/LoadingShop")
const BlankpageShop = () => import("@/views/business/BlankpageShop") 
const LoginShop = () => import("@/views/business/LoginShop") 
const IndexShop = () => import("@/views/business/IndexShop") 
const OrderShop = () => import("@/views/business/OrderShop") 
//车主路径
const LoadingOwner = () => import("@/views/owner/LoadingOwner")
const BlankpageOwner = () => import("@/views/owner/BlankpageOwner") 
const LoginOwner = () => import("@/views/owner/LoginOwner")
const IndexOwner = () => import("@/views/owner/IndexOwner")

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            //redirect: '/loading'
            redirect: '/login'
        },
        {
            path: '/loading',
            name: 'loading',
            component: Loading,
            meta: {keepAlive: false}
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {keepAlive: false}
        },
        
        {
            path: "/index",
            name: "index",
            component: Index,
            meta: {keepAlive: true}
        },
        {
            path: "/deviceManage",
            name: "deviceManage",
            component: DeviceManage
        },
        {
            path: "/carManage",
            name: "carManage",
            component: CarManage
        },
        {
            path: "/presentCar",
            name: "presentCar",
            component: PresentCar
        },
        {
            path: "/detentionInventory",
            name: "detentionInventory",
            component: DetentionInventory
        },
        {
            path: "/blacklist",
            name: "blacklist",
            component: Blacklist
        },
        {
            path: "/blankpage",
            name: "blankpage",
            component: Blankpage
        },
        {
            path: "/statistical",
            name: "statistical",
            component: Statistical
        },
        {
            path: "/addCar",
            name: "addCar",
            component: addCar
        },
        {
            path:"/order",
            name: "order",
            component: Order,
            meta: {keepAlive: false}
        },
        //商户路由
        {
            path: '/loadingShop',
            name: 'loadingShop',
            component: LoadingShop,
            meta: {keepAlive: false}
        },
        {
            path: "/blankpageShop",
            name: "blankpageShop",
            component: BlankpageShop
        },        
        {
            path: '/loginShop',
            name: 'loginShop',
            component: LoginShop,
            meta: {keepAlive: false}
        },
        {
            path: "/indexShop",
            name: "indexShop",
            component: IndexShop,
            meta: {keepAlive: true}
        },
        {
            path:"/orderShop",
            name: "orderShop",
            component: OrderShop,
            meta: {keepAlive: false}
        },
        // 车主路由
        {
            path: '/loadingOwner',
            name: 'loadingOwner',
            component: LoadingOwner,
            meta: {keepAlive: false}
        },
        {
            path: "/blankpageOwner",
            name: "blankpageOwner",
            component: BlankpageOwner
        },        
        {
            path: '/loginOwner',
            name: 'loginOwner',
            component: LoginOwner,
            meta: {keepAlive: false}
        },
        {
            path: "/indexOwner",
            name: "indexOwner",
            component: IndexOwner
        }
    ]
});


export default router

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    if(!token){
        const url=window.location.href;//获取当前地址栏
        const openid=GetQueryByString(url,'openid');//GetQueryByString 自己封装的方法来获取地址栏的参数
        let isURL = window.location.href.indexOf('code=') === -1
        if(isURL){
            wxLogin(to.path)
        }
    }
    if (to.path === '/login'||to.path === '/loginShop'||to.path === '/loginOwner'
        ||to.path === '/'||to.path === '/loadingShop'||to.path === '/loadingOwner') {
        sessionStorage.clear()
        next();
    } else {
        if (token === 'null' || token === '') {
            next('/login');
        } else {
            next();
        }
    }
    next()
})

function wxLogin(path){
    console.log(path,"path");
    const wxLoginJump = (appid, url) => {
        let redirect_uri = encodeURIComponent(url) 
        let snsapi_scope = "snsapi_base"               
        //this.$toast(redirect_uri);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${snsapi_scope}&state=STATUS#wechat_redirect`
    }
    if(path == '/loading'){        
        wxLoginJump(config.appID, config.pageUrl+'/Blankpage')
    }else if(path == '/loadingShop'){
        wxLoginJump(config.appID, config.pageUrl+'/BlankpageShop')
    }
}