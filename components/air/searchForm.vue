<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px">
            <el-form-item label="出发城市">

                <!-- fetch-suggestions: 当输入框输入值时候触发搜索建议事件 -->
                <!-- select：选中下拉框时候触发，参数是选中的参数对象 -->
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                class="el-autocomplete"
                v-model="form.departCity"
                ></el-autocomplete>

            </el-form-item>
            <el-form-item label="到达城市">

                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                class="el-autocomplete"
                v-model="form.destCity"
                ></el-autocomplete>

            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                style="width: 100%;"
                @change="handleDate"
                v-model="form.departDate">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>

import moment, { localeData } from "moment";

export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
            form: {
                departCity: "", // 出发城市
                destCity: "",   // 到达城市
                departDate: "", // 出发日期

                departCode: "", // 出发城市代码
                destCode: ""    // 到达城市代码
            }
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
            if(index === 1){
                this.$message.warning("往返的数据库暂时没有数据")
            }
        },
        
        // 输入文字时候触发
        // value是输入框的值
        // cb 是回调函数,
        queryDepartSearch(value, cb){

            this.querySearchCity(value).then( arr => {
                if(arr.length > 0){
                    // 设置到达城市的第一个为默认值
                    this.form.departCity = arr[0].value;
                    this.form.departCode = arr[0].sort;
                }

                // 执行回调
                cb(arr);
            })
        },

        // 目标城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        async queryDestSearch(value, cb){

            // await的结果是resolve的参数，也就是成功的结果
            const arr = await this.querySearchCity(value);

            if(arr.length > 0){
                // 设置到达城市的第一个为默认值
                this.form.destCity = arr[0].value;
                this.form.destCode = arr[0].sort;
            }

            // 执行回调
            cb(arr);

            // this.querySearchCity(value).then( arr => {
            //     if(arr.length > 0){
            //         // 设置到达城市的第一个为默认值
            //         this.form.destCity = arr[0].value;
            //         this.form.destCode = arr[0].sort;
            //     }

            //     // 执行回调
            //     cb(arr);
            // });
        },

        // 由于出发城市和到达城市的搜索逻辑是一样
        // 不一样的是默认的第一个赋值操作不一样
        querySearchCity(queryString){
            return new Promise((resolve, reject) => {
                // 如果是空就不发起请求
                if(!queryString.trim()){
                    resolve([])
                    return;
                }

                this.$axios({
                    url: "/airs/city",
                    params: {
                        // 搜索关键字，输入框的值
                        name: queryString
                    }
                }).then(res => {
                    const {data} = res.data;

                    // 添加一个value属性，值等于name没有市字
                    const newData = data.map(v => {
                        return {
                            ...v,
                            value: v.name.replace("市", ""), 
                        }
                    });

                    // 默认选中第一个
                    resolve(newData);

                    // this.form.destCity = newData[0].value;
                    // this.form.destCode = newData[0].sort;

                    // 回调函数中的参数必须是一个数组
                    // 数组中每一项必须是一个对象，对象中必须包含value属性
                    //cb(newData);
                });
            })
        },
       
        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            // 把选中对象值赋给表单
            this.form.departCity = item.value;
            this.form.departCode = item.sort;
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            this.form.destCity = item.value;
            this.form.destCode = item.sort;
        },

        // 确认选择日期时触发
        handleDate(value){
           // console.log(value)
           this.form.departDate = moment(value).format("YYYY-MM-DD");
        },

        // 触发和目标城市切换时触发
        handleReverse(){
            const { departCity,departCode, destCity, destCode } = this.form;

            this.form.departCity = destCity;
            this.form.departCode = destCode;

            this.form.destCity = departCity;
            this.form.destCode = departCode;
        },

        // 提交表单是触发
        handleSubmit(){

            // if(){}else if(){} else if(){}

            const rules = {
                departCity: {
                    value: this.form.departCity,
                    message: "请选择出发城市"
                },
                destCity: {
                    value: this.form.destCity,
                    message: "请选择到达城市"
                },
                departDate: {
                    value: this.form.departDate,
                    message: "请选择出发日期"
                }
            }

            // 验证结果，初始值是true
            let valid = true;

            Object.keys(rules).forEach(v => {
                // 如果有一次验证不通过的，直接返回
                if(!valid) return;

                // 如果字段的值为空
                if(!rules[v].value){
                    valid = false;
                    this.$message.warning(rules[v].message)
                }
            });

            if(valid){
                this.$router.push({
                    path: "/air/flights",
                    query: this.form
                })
            }

            // 把搜索记录保存到本地
            const airs = JSON.parse( localStorage.getItem("airs") || `[]`)

            airs.unshift( this.form );

            // 本地存储限制在5个之内
            if(airs.length > 5){
                airs.length = 5;
            }

            localStorage.setItem( 'airs',  JSON.stringify( airs ) );

        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
