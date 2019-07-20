<template>
    <div class="main">
        <div class="air-column">
            <h2>剩机人</h2>
            <el-form class="member-info">

                <div 
                class="member-info-item" 
                v-for="(item, index) in users"
                :key="index"
                >
                    <!-- 用户列表 -->
                    <el-form-item label="乘机人类型">
                        <el-input placeholder="姓名" 
                        class="input-with-select"
                        v-model="users[index].username"
                        >
                            <el-select 
                            slot="prepend" 
                            value="1" 
                            placeholder="请选择">
                                <el-option label="成人" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="证件类型">
                        <el-input 
                        placeholder="证件号码"  
                        class="input-with-select"
                        v-model="users[index].id">
                            <el-select 
                            slot="prepend" 
                            value="1"           
                            placeholder="请选择">
                                <el-option label="身份证" value="1" :checked="true"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <span class="delete-user" @click="handleDeleteUser(index)">-</span>
                </div>
            </el-form>
             <!-- 点击添加乘机人 -->
            <el-button class="add-member" type='primary' @click="handleAddUsers()">添加乘机人</el-button>
        </div>

        <div class="air-column">
            <h2>保险</h2>
            <div>
                <div class="insurance-item"
                v-for="(item , index) in infoData.insurances"
                :key="index">
                    <el-checkbox 
                    :label="`${item.type}：￥${ item.price }/份×1  最高赔付${ item.compensation }`" 
                    @change="handleIsurances( item )"
                    border>
                    </el-checkbox> 
                </div>
            </div>
        </div>

        <div class="air-column">
            <h2>联系人</h2>
            <div class="contact">
                <el-form label-width="60px">
                    <el-form-item label="姓名">
                        <el-input v-model="contactName"></el-input>
                    </el-form-item>

                    <el-form-item label="手机">
                        <el-input placeholder="请输入内容"  v-model="contactPhone">
                            <template slot="append">
                            <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码">
                        <el-input v-model=" captcha "></el-input>
                    </el-form-item>
                </el-form>   
                <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
            </div>
        </div>

        <input type="hidden" :value="allPrice">
    </div>
</template>

<script>
export default {
    data(){
        return {
            users: [ { 
                username: "",
                id: ""
             }, ],                 // 用户列表
            insurances: [ ],        // 保险id集合
            contactName: "",    // 联系人
            contactPhone: "",   // 联系电话
            invoice: false,             // 是否需要发票
            captcha: "",            // 手机验证码 （文档没有说明的）
            seat_xid: "",           // 座位id
            air: "" ,                    // 航班id

            infoData: { // 接口返回的数据集合
                insurances: [],
                seat_infos: {}
            }           
        }
    },

    computed: {
         // 计算总价格
        allPrice(){
            // 如果接口没有请求回来，返回空
            if( !this.infoData.airport_tax_audlet ) return "";

            let price = 0 ;
            // 单价
            price += this.infoData.seat_infos.org_settle_price; 
            // 基建燃油费
            price += this.infoData.airport_tax_audlet;
            // 保险
            price += this.insurances.length * 30;
            // 人数
            price *= this.users.length ;

            this.$store.commit("air/setAllPrice", price)

            return price;
        }
    },

    methods: {
        // 添加乘机人
        handleAddUsers(){
            this.users.push({
                username: "",
                id: ""
            })
        },

        // 删除乘机人
        handleDeleteUser(index){
            this.users.splice( index, 1 );
        },
        
        // 拼接保险的数据
        handleIsurances( item ){
            //console.log(item)

            // 判断数组中是否已经存在该id
            const index = this.insurances.indexOf( item.id );
            if( index > -1){
                this.insurances.splice(  index, 1 )
            }else{
                 this.insurances.push(item.id)
            }
        },

        // 发送手机验证码
        handleSendCaptcha(){
        
            if( !this.contactPhone ){
                this.$alert( "请输入手机号码", "提示" , {
                    type: "warning"
                } );
                return;
            }

            this.$store.dispatch("user/sendCode", this.contactPhone).then( code => {
                this.$alert( `模拟验证码: ${code} ，(6个0)`, "提示" , {
                    type: "warning"
                } );
            } )
        },

        // 提交订单
        handleSubmit(){

            // 数据的拼接
            const data = {
                users: this.users,
                insurances: this.insurances,
                contactName: this.contactName,
                contactPhone: this.contactPhone,
                invoice: this.invoice,
                captcha: this.captcha,

                seat_xid: this.$route.query.seat_xid,
                air: this.$route.query.id
            }

            //  自定义验证
            const rules = {
                users: {
                    value: this.users ,
                    message: "乘机人不能为空"
                },
                contactName: {
                    value: this.contactName,
                    message: "联系人不能空"
                },
                contactPhone: {
                    value: this.contactPhone,
                    message: "联系电话不能空"
                },
                captcha: {
                    value: this.captcha,
                    message: "手机验证码不能空"
                }
            }

            let invalid = true;

            // 循环验证表单的数据
            Object.keys(rules).forEach(v => {
                if(!invalid) return;
                // 针对处理用户列表，
                if( v === "users" ){

                    // 循环判断是不是每个用户username和id都是有值的
                    rules[v].value.map( user => {
                         if(!invalid) return;
                        // （user）rules里面的users数组每一项
                        if(  !(user.username && user.id)  ){
                            invalid = false;
                             this.$message.warning( rules[v].message )
                        }
                    } );
                }

                // 值如果为空或者是false
                if(!rules[v].value){
                    invalid = false;
                    this.$message.warning( rules[v].message )
                }
            })

            if(!invalid) return;

            // 订单提交
            this.$axios({
                url: "/airorders",
                method: "POST",
                data,
                //  添加授权的头信息
                headers: {
                    // 下面请求头信息不是通用的，针对当前的项目的（基于JWT token标准）
                    Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
                }
            }).then(res => {
                const {data} = res.data;

                this.$message.success('订单提交成功，正在跳转...');

                setTimeout(() => {
                    // 跳转到付款页
                    this.$router.push("/air/pay?id=" + data.id);
                }, 1500)

            })
        }
    },

    mounted(){

        const { id, seat_xid } = this.$route.query;
        // 请求选中的机票的数据
        this.$axios({
            url: "/airs/" + id,
            params: {
                seat_xid,
            }
        }).then(res => {
            const {data} = res;
            // 机票的信息
            this.infoData = data;

            // 返回给父组件
            //this.$emit("setInfoData",  data)

            // 保存给store
            this.$store.commit("air/setInfoData", data);
        })
    }
}
</script>

<style scoped lang="less">
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }

    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }

    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select{
        width:590px;
    }

    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }

    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;

        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }

    .add-member{
        margin-top:20px;
    }

    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }

    .insurance{
        > div{
            margin-top:10px;
        }
    }

    .insurance-item{
        margin-bottom: 20px;
    }

    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }

    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }
</style>