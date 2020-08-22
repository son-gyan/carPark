import {
    SET_USER,
    SET_ORGCATEGORY,
    SET_DEPID
} from '../type'
export default {
    state: {
        user:'',
        orgCategory:'',
        depId:''
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
    }
}