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
const Refund = () => import("@/views/admin/Refund") 
const Detail = () => import("@/views/admin/Detail") 
const InOut = () => import("@/views/admin/InOut") 
const PayRecords = () => import("@/views/admin/PayRecords") 
const Member = () => import("@/views/admin/Member") 
const Examine = () => import("@/views/admin/Examine") 
const detailExamine = () => import("@/views/admin/detailExamine") 
const setMeal = () => import("@/views/admin/member/setMeal") 
const user = () => import("@/views/admin/member/user") 
const consume = () => import("@/views/admin/member/consume") 
const recharge = () => import("@/views/admin/member/recharge") 
const dues = () => import("@/views/admin/member/dues") 
const project = () => import("@/views/admin/member/project") 
//商户路径
const LoadingShop = () => import("@/views/business/LoadingShop")
const BlankpageShop = () => import("@/views/business/BlankpageShop") 
const LoginShop = () => import("@/views/business/LoginShop") 
const IndexShop = () => import("@/views/business/IndexShop") 
const OrderShop = () => import("@/views/business/OrderShop") 
const couponsIndex = () => import("@/views/business/coupons/index") 
const issueCoupons = () => import("@/views/business/coupons/issueCoupons") 
const stock = () => import("@/views/business/coupons/stock") 
const stockDetail = () => import("@/views/business/coupons/stockDetail") 
const rechargeRecord = () => import("@/views/business/coupons/rechargeRecord") 
const grant = () => import("@/views/business/coupons/grant") 
const usageRecord = () => import("@/views/business/coupons/usageRecord") 
const returnRecord = () => import("@/views/business/coupons/returnRecord") 
const inventoryRecharge = () => import("@/views/business/coupons/inventoryRecharge") 
const banquetCoupons = () => import("@/views/business/coupons/banquetCoupons") 
const dynamicCoupons = () => import("@/views/business/coupons/dynamicCoupons") 
const showQrCode = () => import("@/views/business/coupons/showQrCode") 
//车主路径
const LoadingOwner = () => import("@/views/owner/LoadingOwner")
const BlankpageOwner = () => import("@/views/owner/BlankpageOwner") 
const LoginOwner = () => import("@/views/owner/LoginOwner")
const IndexOwner = () => import("@/views/owner/IndexOwner")
const myCar = () => import("@/views/owner/myCar")
const payment = () => import("@/views/owner/payment")
const carPark = () => import("@/views/owner/carPark")
const bill = () => import("@/views/owner/bill")
const monthlyCar = () => import("@/views/owner/monthlyCar")
const renew = () => import("@/views/owner/renew")
const invoice = () => import("@/views/owner/invoice")
const afterPayment = () => import("@/views/owner/afterPayment")
const memberRecharge = () => import("@/views/owner/member")
const temporaryStop = () => import("@/views/owner/temporaryStop")
const payTasaday = () => import("@/views/owner/payTasaday")
const advert = () => import("@/views/owner/advert")
const contactUs = () => import("@/views/owner/contactUs")

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

const router = new Router({
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
    },
    mode: 'history',
    routes: [
        { path: "/",redirect: '/login' },//redirect: '/loading'
        { path: '/loading',name: 'loading',component: Loading,meta: {keepAlive: false} },
        { path: '/login', name: 'login',component: Login,meta: {keepAlive: false} },
        { path: "/index", name: "index",component: Index,meta: {keepAlive: true} },
        { path: "/deviceManage", name: "deviceManage",component: DeviceManage },
        { path: "/carManage",name: "carManage",component: CarManage },
        { path: "/presentCar",name: "presentCar",component: PresentCar },
        { path: "/detentionInventory", name: "detentionInventory",component: DetentionInventory },
        { path: "/blacklist",name: "blacklist",component: Blacklist },
        { path: "/blankpage", name: "blankpage",component: Blankpage },
        { path: "/statistical",name: "statistical",component: Statistical },
        { path: "/addCar",name: "addCar",component: addCar },
        { path:"/order",name: "order",component: Order,meta: {keepAlive: false} },
        { path:"/refund",name: "refund",component: Refund },
        { path:"/detail",name: "detail",component: Detail },
        { path:"/inOut",name: "inOut",component: InOut },
        { path:"/payRecords",name: "payRecords",component: PayRecords },
        { path:"/member",name: "member",component: Member },
        { path:"/examine",name: "examine",component: Examine },
        { path:"/detailExamine",name: "detailExamine",component: detailExamine },
        { path:"/setMeal",name: "setMeal",component: setMeal },
        { path:"/user", name: "user",component: user },
        { path:"/consume",name: "consume",component: consume },
        { path:"/recharge",name: "recharge",component: recharge },
        { path:"/dues", name: "dues", component: dues },
        { path:"/project",name: "project",component: project },
        //商户路由
        { path: '/loadingShop', name: 'loadingShop', component: LoadingShop,meta: {keepAlive: false} },
        { path: "/blankpageShop",name: "blankpageShop",component: BlankpageShop },        
        { path: '/loginShop',name: 'loginShop',component: LoginShop, meta: {keepAlive: false} },
        { path: "/indexShop",name: "indexShop", component: IndexShop,meta: {keepAlive: true} },
        { path:"/orderShop", name: "orderShop",component: OrderShop,meta: {keepAlive: false} },
        { path:"/couponsIndex", name: "couponsIndex",component: couponsIndex },
        { path:"/issueCoupons", name: "issueCoupons",component: issueCoupons },
        { path:"/stock", name: "stock",component: stock },
        { path:"/stockDetail", name: "stockDetail",component: stockDetail },
        { path:"/rechargeRecord", name: "rechargeRecord",component: rechargeRecord },
        { path:"/grant", name: "grant",component: grant },
        { path:"/usageRecord", name: "usageRecord",component: usageRecord },
        { path:"/returnRecord", name: "returnRecord",component: returnRecord },
        { path:"/inventoryRecharge", name: "inventoryRecharge",component: inventoryRecharge },
        { path:"/banquetCoupons", name: "banquetCoupons",component: banquetCoupons },
        { path:"/dynamicCoupons", name: "dynamicCoupons",component: dynamicCoupons,meta: {keepAlive: true}  },
        { path:"/showQrCode", name: "showQrCode",component: showQrCode },
        // 车主路由
        { path: '/loadingOwner',name: 'loadingOwner',component: LoadingOwner,meta: {keepAlive: false} },
        { path: "/blankpageOwner",name: "blankpageOwner",component: BlankpageOwner },        
        { path: '/loginOwner',name: 'loginOwner',component: LoginOwner,meta: {keepAlive: false} },
        { path: "/indexOwner",name: "indexOwner",component: IndexOwner },
        { path: "/myCar",name: "myCar",component: myCar },
        { path: "/payment",name: "payment",component: payment },
        { path: "/carPark",name: "carPark",component: carPark },
        { path: "/bill",name: "bill",component: bill },
        { path: "/monthlyCar",name: "monthlyCar",component: monthlyCar },
        { path: "/renew",name: "renew",component: renew },
        { path: "/invoice",name: "invoice",component: invoice },
        { path: "/afterPayment",name: "afterPayment",component: afterPayment },
        { path: "/memberRecharge",name: "memberRecharge",component: memberRecharge },
        { path: "/temporaryStop", name: "temporaryStop",component: temporaryStop },
        { path: "/payTasaday", name: "payTasaday", component: payTasaday },
        { path: "/advert",name: "advert",component: advert },
        { path: "/contactUs", name: "contactUs",component: contactUs }
    ]
});

export default router

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    //debugger
    if(!token){  /*  &&to.path.indexOf('Owner')==-1 */
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
        if(to.path.indexOf('Shop')>-1){
            if (token === 'null' || token === '') {
                next('/loginShop');
            } else {
                next();
            }
        }else if(to.path.indexOf('Owner')==-1){  /* to.path === '/indexShop' */
            if (token === 'null' || token === '') {
                next('/loginOwner');
            } else {
                next();
            }
        }else{
            if (token === 'null' || token === '') {
                next('/login');
            } else {
                next();
            }
        }
    }
    next()
})

function wxLogin(path){
    console.log(path,"path");
    let snsapiScope = "snsapi_base" 
    const wxLoginJump = (appid, url,snsapi_scope) => {
        let redirect_uri = encodeURIComponent(url)              
        //this.$toast(redirect_uri);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${snsapi_scope}&state=STATUS#wechat_redirect`
    }
    if(path == '/loading'){        
        wxLoginJump(config.appID, config.pageUrl+'/Blankpage',snsapiScope)
    }else if(path == '/loadingShop'){
        wxLoginJump(config.appID, config.pageUrl+'/BlankpageShop',snsapiScope)
    }else if(path == '/loadingOwner'){
        snsapiScope="snsapi_userinfo"
        wxLoginJump(config.appID, config.pageUrl+'/BlankpageOwner',snsapiScope)
    }
}