import Vue from "vue";
import Router from "vue-router";
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
            redirect: '/loading'
            //redirect: '/login'
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
        }
    ]
});


export default router

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    if (to.path === '/login'||to.path === '/loginShop'||to.path === '/'||to.path === '/loadingShop') {
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