import Vue from "vue";
import Router from "vue-router";

/* import Login from "@/views/Login";
import Index from "@/views/Index";
import DeviceManage from "@/views/DeviceManage";
import CarManage from "@/views/CarManage";
import PresentCar from "@/views/PresentCar";
import DetentionInventory from "@/views/DetentionInventory";
import Blacklist from "@/views/Blacklist";
import Blankpage from "@/views/Blankpage";
import Statistical from "@/views/Statistical";
import addCar from "@/components/addCar"; */

const Login = () => import("@/views/Login") 
const Index = () => import("@/views/Index") 
const DeviceManage = () => import("@/views/DeviceManage") 
const CarManage = () => import("@/views/CarManage") 
const PresentCar = () => import("@/views/PresentCar") 
const DetentionInventory = () => import("@/views/DetentionInventory") 
const Blacklist = () => import("@/views/Blacklist") 
const Blankpage = () => import("@/views/Blankpage") 
const Statistical = () => import("@/views/Statistical") 
const addCar = () => import("@/components/addCar") 
const Loading = () => import("@/views/Loading")

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
    ]
});


export default router

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    if (to.path === '/login') {
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