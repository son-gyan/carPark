import {
    SET_USER,
    SET_ORGCATEGORY,
    SET_DEPID,
    SET_CARPARKINFO,
    SET_DEPARTINFO
} from '../type'
export default {
    state: {
        user:'',
        orgCategory:'',
        depId:'',
        carParkInfo:{},
        departInfo:{}
    },
    getters: {
        user (state) {
            return state.user
        },
        orgCategory(state) {
            return state.orgCategory
        },
        depId(state) {
            return state.depId
        },
        carParkInfo(state) {
            return state.carParkInfo
        },
        departInfo(state) {
            return state.departInfo
        },
    },
    mutations: {
        [SET_USER]: (state, user) => {
            state.user = user
            sessionStorage.setItem('user', JSON.stringify(user))
        },
        [SET_ORGCATEGORY]: (state, orgCategory) => {
            state.orgCategory = orgCategory
            sessionStorage.setItem('orgCategory', orgCategory)
        },
        [SET_DEPID]: (state, depId) => {
            state.depId = depId
            sessionStorage.setItem('depId', depId)
        },
        [SET_CARPARKINFO]: (state, carParkInfo) => {
            state.carParkInfo = carParkInfo
            sessionStorage.setItem('carParkInfo', JSON.stringify(carParkInfo))
        },
        [SET_DEPARTINFO]: (state, departInfo) => {
            state.departInfo = departInfo
            sessionStorage.setItem('departInfo', JSON.stringify(departInfo))
        },
    },
    actions: {
        setUser ({ commit }, user) {
            commit(SET_USER, user)
        },
        setOrgCategory ({ commit }, orgCategory) {
            commit(SET_ORGCATEGORY, orgCategory)
        },
        setDepId ({ commit }, depId) {
            commit(SET_DEPID, depId)
        },
        setCarParkInfo ({ commit }, carParkInfo) {
            commit(SET_CARPARKINFO, carParkInfo)
        },
        setDepartInfo ({ commit }, departInfo) {
            commit(SET_DEPARTINFO, departInfo)
        },
    }
}