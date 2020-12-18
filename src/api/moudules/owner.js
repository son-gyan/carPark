import axios from '../axios'
const header = {
    "Content-Type": "multipart/form-data;charset=utf-8"
}

// 车主微信登录
export const wxlogin = (data) => {
    return axios({
        url: '/park/sys/czwxLogin',
        method: 'post',
        data,
        headers: header
    })
}

//获取短信验证码 /park/sys/czwxRegister
export const getPhoneCode = (data) => {
    return axios({
        url: '/park/sys/sendSms',
        method: 'POST',
        data,
        headers: header
    })
}

// 注册
export const register = (data) => {
    return axios({
        url: '/park/sys/czwxRegister',
        method: 'POST',
        data,
        headers: header
    })
}

// 我的车辆列表
export const getMyCarList = (params) => {
    return axios({
        url: '/park/zyb/zybCarOwner/myCarlist',
        method: 'get',
        params
    })
}
// 新增我的车辆
export const addMyCar = (data) => {
    return axios({
        url: '/park/zyb/zybCarOwner/addCar',
        method: 'post',
        data,
        headers: header
    })
}
// 删除我的车辆
export const delMyCar = (data) => {
    return axios({
        url: '/park/zyb/zybCarOwner/deleteCar',
        method: 'DELETE',
        data,
        headers: header
    })
}

// 停车账单列表
export const getBillList = (params) => {
    return axios({
        url: '/park/zyb/data/myCarRecordlist',
        method: 'get',
        params
    })
}

// 补缴停车费列表
export const getAfterPaymentList = (params) => {
    return axios({
        url: '/park/zyb/data/myCarNeedRepairPaylist',
        method: 'get',
        params
    })
}

// 临停缴费列表
export const getTemporaryStopList = (params) => {
    return axios({
        url: '/park/zyb/data/myCarNeedPaylist',
        method: 'get',
        params
    })
}

// 代人缴费列表
export const getPayTasadayList = (params) => {
    return axios({
        url: '/park/zyb/data/helpPaylist',
        method: 'get',
        params
    })
}

// 我的月租车列表
export const getMonthlyCarList = (params) => {
    return axios({
        url: '/park/zyb/zybVehicle/myMonthCarlist',
        method: 'get',
        params
    })
}

// 月租车 获取车场列表 /park/zyb/zybParkInfo/myMonthCarlist
export const getCarList = () => {
    return axios({
        url: '/park/zyb/zybParkInfo/myMonthCarlist',
        method: 'get'
    })
}
// 支付
export const getpayadress = (data) => {
    return axios({
        url: '/park/zyb/pay/outCodePay',
        method: 'post',
        data
    })
}

//预付  getAdvancePay
export const getAdvancePay = (data) => {
    return axios({
        url: '/park/zyb/pay/preInPay',
        method: 'post',
        data
    })
}