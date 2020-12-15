import axios from '../axios'
const header = {
    "Content-Type": "multipart/form-data;charset=utf-8"
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

// 停车账单列表
export const getBillList = (params) => {
    return axios({
        url: '/park/zyb/data/payList',
        method: 'get',
        params
    })
}

// 补缴停车费列表
export const getAfterPaymentList = (params) => {
    return axios({
        url: '/park/zyb/data/payList',
        method: 'get',
        params
    })
}

// 临停缴费列表
export const getTemporaryStopList = (params) => {
    return axios({
        url: '/park/zyb/data/payList',
        method: 'get',
        params
    })
}

// 我的月租车列表
export const getMonthlyCarList = (params) => {
    return axios({
        url: '/park/zyb/data/payList',
        method: 'get',
        params
    })
}