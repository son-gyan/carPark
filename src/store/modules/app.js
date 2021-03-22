import {
    SET_USER,
    SET_VIPUSER,
    SET_ORGCATEGORY,
    SET_DEPID,
    SET_CARPARKINFO,
    SET_DEPARTINFO,
    SET_MERINFO
} from '../type'
export default {
    state: {
        user:'',
        vipUser:'',
        orgCategory:'',
        depId:'',
        carParkInfo:{},
        departInfo:{},
        merInfo:{}
    },
    getters: {
        user (state) {
            return state.user
        },
        vipUser (state) {
            return state.vipUser
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
        merInfo(state) {
            return state.merInfo
        },
    },
    mutations: {
        [SET_USER]: (state, user) => {
            state.user = user
            sessionStorage.setItem('user', JSON.stringify(user))
        },
        [SET_VIPUSER]: (state, vipUser) => {
            state.vipUser = vipUser
            sessionStorage.setItem('vipUser', JSON.stringify(vipUser))
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
        [SET_MERINFO]: (state, merInfo) => {
            state.merInfo = merInfo
            sessionStorage.setItem('merInfo', JSON.stringify(merInfo))
        },
    },
    actions: {
        setUser ({ commit }, user) {
            commit(SET_USER, user)
        },
        setVipUser ({ commit }, vipUser) {
            commit(SET_VIPUSER, vipUser)
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
        setMerInfo ({ commit }, merInfo) {
            commit(SET_MERINFO, merInfo)
        },
    }
}