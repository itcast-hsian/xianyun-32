// 每个小仓库都必须暴露出 state, mutations, actions

export const state = {
    userInfo: {
        // 用户验证的token'
        token: "",
        // 用户信息
        user: {}

        // 插件会自动读取本地的数据到store
        // user: JSON.parse( window.localStorage.getItem("userInfo") || `{}`)
    } 
}

export const mutations = {
    // 设置用户信息
    setUserInfo(state, data){
        state.userInfo = data;

        // 插件会自动把store的数据保存到本地，不需要手动的保存
        // localStorage.setItem("userInfo", JSON.stringify(data));
    },

    // 设置用户数据为空
    clearUserInfo(state){
        state.userInfo = {
            token: "",
            user: {}
        }
    }
}