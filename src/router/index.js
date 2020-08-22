import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import Index from "@/views/Index";
import DeviceManage from "@/views/DeviceManage";
import CarManage from "@/views/CarManage";
import PresentCar from "@/views/PresentCar";
import DetentionInventory from "@/views/DetentionInventory";
import Blacklist from "@/views/Blacklist";
import Statistical from "@/views/Statistical";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: "/index",
            name: "index",
            component: Index
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
            path: "/statistical",
            name: "statistical",
            component: Statistical
        },
    ]
});


export default router

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    /* if(token){
        next({
            path:from.fullPath
        });   
    }else{        
        // 重定向到登录页面
        next({
            path:'/login'
        })
    } */
    next()
})