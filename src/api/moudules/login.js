import axios from '../axios'

// 查找导航菜单树
export const login = (data) => {
    return axios({
        url: '/park/sys/login',
        method: 'post',
        data
    })
}