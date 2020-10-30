import service from '@/api/service'

const state = {
    autoSelectData: {},
    autoCascaderData: {},
}
const getters = {}
const mutations = {
    //单选公用
    getAutoSelectData(state, payload) {
        state.autoSelectData = {
            ...state.autoSelectData,
            [payload.dataType]: payload.data
        }
    },
    //级联公用
    getAutoCascaderData(state, payload) {
        state.autoCascaderData = {
            ...state.autoCascaderData,
            [payload.dataType]: payload.data
        }
    },
}
const actions = {
    // 单选公用
    async getAutoSelectData({commit}, params) {
        switch (params.dataType) {
            //角色
            case 'role':
                const role = await service.getRoleList({
                    pageNum: 1,
                    pageSize: 1000
                })
                if (role.code === 20000 && role.data.result) {
                    commit('getAutoSelectData', {
                        dataType: params.dataType,
                        data: mapSelectDataInt(role.data.result)
                    })
                }
                break
            //部门
            case 'dept':
                const dept = await service.getDepartmentList({
                    pageNum: 1,
                    pageSize: 1000
                })
                if (dept.code === 20000 && dept.data.result) {
                    commit('getAutoSelectData', {
                        dataType: params.dataType,
                        data: mapSelectDataInt(dept.data.result)
                    })
                }
                break
        }
    },
    // 级联公用
    async getAutoCascaderData({commit}, params) {
        switch (params.dataType) {
            //菜单
            case 'menu':
                const menu = await service.getMenuTree({})
                if (menu.code === 20000 && menu.data) {
                    commit('getAutoCascaderData', {
                        dataType: params.dataType,
                        data: mapMenuData(menu.data)
                    })
                }
                break
            default:
                break
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

const mapMenuData = data => {
    return data ? data.map(item => {
        return {
            value: item.id,
            label: item.name,
            children: mapMenuData(item.subMenus)
        }
    }) : data
}

const mapSelectDataInt = data => {
    return data ? data.map(item => {
        return {
            value: item.id,
            label: item.name
        }
    }) : null
}