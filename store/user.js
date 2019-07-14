// 每个仓库都必须暴露出 state, mutations, actions
export const state = () => {
    return {
        userInfo: {
            // 用户验证的token'
            token: "",
            // 用户信息
            user: {}
    
            // 插件会自动读取本地的数据到store
            // user: JSON.parse( window.localStorage.getItem("userInfo") || `{}`)
        } 
    }
}

// 同步的修改仓库的数据
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

// 异步修改仓库数据
export const actions = {

    // 发送手机验证码
    sendCode(store, phoneNumber){
        return this.$axios({
            url: "/captchas",
            method: "POST",
            data: {
                tel: phoneNumber
            }
        }).then(res => {
            const {code} = res.data;

            return code;
        });
    },

    // 处理登录的方法, actions的第一个参数store对象， 第二个参数是传入的参数
    login(store, data){
        // 在store模块中可以同this访问$axios,跟组件没关系
        return this.$axios({
            url: "/accounts/login",
            data,
            method: "POST"
        }).then(res => {
            //console.log(store);
            //console.log(res.data);

            // 保存到vuex
            store.commit("setUserInfo", res.data)

            // 登录后的行为应该由调用的页面去执行，
            // 不能写死，因为每个页面登录成功执行的操作可能不一样
            // this.$router.push("/");
        });
    },

    // register(){}
}