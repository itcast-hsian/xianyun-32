
<template>
    <div class="container">
        <div class="main">
            <div class="pay-title">
                支付总金额 <span class="pay-price">￥ 1000</span>
            </div>
            <div class="pay-main">
                <h4>微信支付</h4>
                <el-row type="flex" 
                justify="space-between" 
                align="middle"
                class="pay-qrcode">
                    <div class="qrcode">

                        <!-- 二维码生成位置 -->
                        <canvas id="qrcode-stage"></canvas>

                        <p>请使用微信扫一扫</p>
                        <p>扫描二维码支付</p>
                    </div>
                    <div class="pay-example">
                        <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt="">
                    </div>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>

// 生成二维码的包
import QRCode from "qrcode";

export default {
    data(){
        return {
            timer: null
        }
    },

    methods: {
        // 检测付款状态
        isPay( data ){
            return this.$axios({
                url: "/airorders/checkpay",
                method: "POST",
                data: {
                    id: data.id,
                    nonce_str: data.price,
                    out_trade_no: data.orderNo
                },
                //  添加授权的头信息
                headers: {
                    // 下面请求头信息不是通用的，针对当前的项目的（基于JWT token标准）
                    Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
                }
            }).then(res => {
                
                const {statusTxt} = res.data;

                if(statusTxt === "支付完成"){
                     return true; 
                }else{
                    return false;
                }               
            })
        }
    },

    mounted(){
        const {id} = this.$route.query;

        setTimeout(() => {
            // GET请求
            this.$axios( {
                url: "/airorders/" + id,
                //  添加授权的头信息
                headers: {
                    // 下面请求头信息不是通用的，针对当前的项目的（基于JWT token标准）
                    Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
                }
            } ).then(res => {
                
                // 付款链接
                const { code_url } = res.data.payInfo;

                // 插件要求的canvas标签
                var canvas = document.getElementById('qrcode-stage');

                // 生成二维码到canvas
                QRCode.toCanvas(canvas,  code_url);

                // 调用付款状态的查询
                this.timer = setInterval(async () => {
                   const pay = await this.isPay(res.data);
                   if(pay){
                       this.$message.success("订单支付完成");
                       
                       clearInterval( this.timer );
                       return;
                   }
                }, 3000);
            })
        }, 10) 
    }
}
</script>

<style scoped lang="less">
.container{
    background:#f5f5f5;
    padding: 30px 0;

    .main{
        width:1000px;
        margin:0 auto;

        .pay-title{
            text-align: right;
            span{
                font-size:28px;
                color:orangered;
            }
        }

        .pay-main{
            background:#fff;
            margin-top:10px;
            border-top: 5px orange solid;
            padding:30px;

            h4{
                font-size: 28px;
                font-weight: normal;
                margin-bottom: 10px;
            }

            .pay-qrcode{
                padding:0 80px;
            }

            .qrcode{
                border:1px #ddd solid;
                padding:15px;
                height: fit-content;

                #qrcode-stage{
                    width:200px;
                    height:200px;
                    margin-bottom: 10px;
                }

                p{
                    line-height: 2;
                    text-align: center;
                }
            }
        }
    }
}
</style>