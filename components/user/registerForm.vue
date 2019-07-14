<template>
    <el-form 
        :model="form" 
        ref="form" 
        :rules="rules" 
        class="form">
            <el-form-item class="form-item" prop="username">
                <el-input 
                v-model="form.username"
                placeholder="用户名手机">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="captcha">
                <el-input 
                v-model="form.captcha"
                placeholder="验证码" >
                    <template slot="append">
                        <el-button @click="handleSendCaptcha">
                            发送验证码
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="nickname">
                <el-input 
                v-model="form.nickname"
                placeholder="你的名字">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="password">
                <el-input 
                v-model="form.password"
                placeholder="密码" 
                type="password"
                ></el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="checkPassword">
                <el-input 
                v-model="form.checkPassword"
                placeholder="确认密码" 
                type="password">
                </el-input>
            </el-form-item>

            <el-button 
            class="submit" 
            type="primary" 
            @click="handleRegSubmit">
                注册
            </el-button>
        </el-form>
</template>

<script>
export default {
    data(){

        // rule是当前规则（用不上）
        // value是输入框的值
        // callback 是回调函数，必须要调用，调用才能报错
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {
            // 表单数据
            form: {
                username: "",
                captcha: "",
                nickname: "", // 昵称
                password: "",
                checkPassword: ""
            },
            // 表单规则
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur"},
                ],
                captcha: [
                    { required: true, message: "请输入验证码", trigger: "blur"},
                ],
                nickname: [
                    { required: true, message: "请输入昵称", trigger: "blur"},
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur"},
                ],
                checkPassword: [
                    // validator： 自定义的验证函数
                    { validator: validatePass, trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        // 发送验证码
        handleSendCaptcha(){

            // 获取手机号码
            const phoneNumber = this.form.username;

            // 判断手机号码为空
            if(!phoneNumber.trim()){
                this.$confirm('手机号码不能为空', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                });

                return;
            }

            // 请求手机验证码接口
            // 1. this.$axios()

            // 2. 
            this.$store.dispatch("user/sendCode", phoneNumber).then(res => {

                this.$confirm(`当前验证码是: ${res}`, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                });
            })
        },


        // 注册
        handleRegSubmit(){
           // console.log(this.form)
           this.$refs.form.validate(valid => {
               if(valid){
                    // ...props表单除了checkPassword以外的其他属性
                    const { checkPassword, ...props } = this.form;

                    // 调用注册接口
                    this.$axios({
                        url: "/accounts/register",
                        method: "POST",
                        data: props
                    }).then(res => {
                            //console.log(res.data);
                            // 保存到vuex
                            this.$store.commit("user/setUserInfo", res.data);
                            this.$router.push("/");
                    })
                    //    .catch(err => {
                    //        console.log(err.response, 123)
                    //    })
               }
           })
        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>