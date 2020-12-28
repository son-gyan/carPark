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

