import axios from '../axios'
const header = {
    "Content-Type": "multipart/form-data;charset=utf-8"
}
// 获取当前项目列表
export const getProject = (params) => {
    return axios({
        url: '/park/sys/sysDepart/list',
        method: 'get',
        params
    })
}
// 获取车场列表
export const getCarPark = (params) => {
    return axios({
        url: '/park/zyb/zybParkInfo/list',
        method: 'get',
        params
    })
}
// 获取设备管理列表
export const getDeviceList = (params) => {
    return axios({
        url: '/park/zyb/zybVehicleLane/cameraList',
        method: 'get',
        params
    })
}
// 开闸
export const gateOpen = (data) => {
    return axios({
        url: '/park/zyb/zybVehicleLane/gateOpen',
        method: 'post',
        data,
        headers: header
    })
}
// 关闸
export const gateClose = (data) => {
    return axios({
        url: '/park/zyb/zybVehicleLane/gateClose',
        method: 'post',
        data,
        headers: header
    })
}
// 重启
export const restart = (data) => {
    return axios({
        url: '/park/zyb/zybVehicleLane/restart',
        method: 'post',
        data,
        headers: header
    })
}
// 获取车辆列表
export const getCarList = (params) => {
    return axios({
        url: '/park/zyb/zybVehicle/list',
        method: 'get',
        params
    })
}
// 获取收费标准列表
export const getZybFeesList = (params) => {
    return axios({
        url: '/park/zyb/zybFees/list',
        method: 'get',
        params
    })
}
// 获取套餐列表
export const getPackageList = (params) => {
    return axios({
        url: '/park/yzb/package/list',
        method: 'get',
        params
    })
}
// 获取新增车辆
export const addCar = (data) => {
    return axios({
        url: '/park/zyb/zybVehicle/add',
        method: 'post',
        data
    })
}
// 获取删除车辆
export const delCar = (data) => {
    return axios({
        url: '/park/zyb/zybVehicle/delete',
        method: 'DELETE',
        data,
        headers: header 
    })
}
// 延期车辆
export const customRecharge = (data) => {
    return axios({
        url: '/park/zyb/zybVehicle/customRecharge',
        method: 'post',
        data
    })
}

//获取在场车辆列表
export const getPresentCarList = (params) => {
    return axios({
        url: '/park/zyb/data/onParkList',
        method: 'get',
        params
    })
}
// 新增修改在场车辆
export const addPresentCar = (data) => {
    return axios({
        url: '/park/zyb/data/add',
        method: 'post',
        data
    })
}
