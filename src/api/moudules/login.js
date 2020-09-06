import axios from '../axios'
const header = {
    "Content-Type": "multipart/form-data;charset=utf-8"
}
// 查找导航菜单树
export const login = (data) => {
    return axios({
        url: '/park/sys/login',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const wxlogin = (data) => {
    return axios({
        url: '/park/sys/weixinLogin',
        method: 'post',
        data,
        headers: header
    })
}