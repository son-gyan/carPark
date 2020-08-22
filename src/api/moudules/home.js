import axios from '../axios'

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