import {
    SET_USER,
    SET_ORGCATEGORY,
    SET_DEPID,
    SET_CARPARKINFO,
} from '../type'
export default {
    state: {
        user:'',
        orgCategory:'',
        depId:'',
        carParkInfo:{}
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
    },
    mutations: {
        [SET_USER]: (state, user) => {
            state.user = user
            sessionStorage.setItem('user', user)
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
            sessionStorage.setItem('carParkInfo', carParkInfo)
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
    }
}