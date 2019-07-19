// this.$message
import {Message} from "element-ui";

// 当前nuxt的对象
export default ( { $axios, redirect } ) => {

    // 拦截axios的错误请求
    $axios.onError(err => {
        // console.log(err.response.data);
        
        // err.response 获取返回信息
        const {message, statusCode} = err.response.data;

        // 未授权
        if( statusCode === 401 || statusCode === 403 ){
            // 跳转到登录页
            redirect("/user/login");
        }

        if(statusCode === 400){
            // 错误警告
            Message.warning(message)
        }
    })
}

