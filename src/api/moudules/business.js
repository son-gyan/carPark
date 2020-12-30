import axios from '../axios'
const header = {
    "Content-Type": "multipart/form-data;charset=utf-8"
}

// 预约车辆列表 /park/zyb/reservecar/merReserveCarlist
export const getOrderCarList = (params) => {
    return axios({
        url: '/park/zyb/reservecar/merReserveCarlist',
        method: 'get',
        params
    })
}

// 新增预约车辆
export const addOrderCar = (data) => {
    return axios({
        url: '/park/zyb/reservecar/addReserveCar',
        method: 'post',
        data
    })
}

// 确认离场车辆
export const exitOrderCar = (data) => {
    return axios({
        url: '/park/zyb/reservecar/departure',
        method: 'post',
        data,
        headers: header 
    })
}
// 删除预约车辆
export const delOrderCar = (data) => {
    return axios({
        url: '/park/zyb/reservecar/delReserveCar',
        method: 'DELETE',
        data,
        headers: header 
    })
}

// 商户优惠券库存列表  /park/zyb/coupon/listMerDiscountStock
export const listMerDiscountStock = (params) => {
    return axios({
        url: '/park/zyb/coupon/listMerDiscountStock',
        method: 'get',
        params
    })
}


//定额优惠券列表
export const listDisQuota = (params) => {
    return axios({
        url: '/park/zyb/coupon/listDisQuota',
        method: 'get',
        params
    })
}

//商户充值记录
export const listMerRechargeRecord = (params) => {
    return axios({
        url: '/park/zyb/coupon/listMerRechargeRecord',
        method: 'get',
        params
    })
}
//券发放记录
export const quotaGrantList = (params) => {
    return axios({
        url: '/park/zyb/coupon/quotaGrantList',
        method: 'get',
        params
    })
}

//指定车牌发券
export const addDirectionalQuota = (data) => {
    return axios({
        url: '/park/zyb/coupon/addDirectionalQuota',
        method: 'POST',
        data
    })
}

//商户已绑套餐列表
export const bindDisPacklist = (params) => {
    return axios({
        url: '/park/zyb/coupon/bindDisPacklist',
        method: 'get',
        params
    })
}