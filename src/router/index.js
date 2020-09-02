import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import Index from "@/views/Index";
import DeviceManage from "@/views/DeviceManage";
import CarManage from "@/views/CarManage";
import PresentCar from "@/views/PresentCar";
import DetentionInventory from "@/views/DetentionInventory";
import Blacklist from "@/views/Blacklist";
import Blankpage from "@/views/Blankpage";
import Statistical from "@/views/Statistical";
import addCar from "@/components/addCar";

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
            redirect: '/login'
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