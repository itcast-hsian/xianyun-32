<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                    
                </div>
                
                <!-- 航班头部布局 -->
                <FlightsListHead/>
                
                
                <!-- 航班信息 -->
                <FlightsItem 
                v-for="(item, index) in dataList"
                :key="index"
                :data="item"/>

                <!-- 分页布局 -->
                <!-- size-change：切换条数时候触发 -->
                <!-- current-change: 切换页数时候触发 -->
                <!-- page-size: 默认一页多少条数据 -->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
            </div>
        </el-row>
    </section>
</template>

<script>

import FlightsListHead from "@/components/air/flightsListHead.vue"
import FlightsItem from "@/components/air/flightsItem.vue"

export default {
    data(){
        return {
            flightsData: {
                flights: []
            }, // 后台返回的所有数据
            dataList: [], // 永远都是当前页数的数据
            
            pageIndex: 1, // 当前页数
            pageSize: 5, // 当前页面的条数
            total: 0, // 总条数
        }
    },

    components: {
        FlightsListHead,
        FlightsItem
    },

    // computed: {
    //     // 当前页面渲染的列表数据
    //     dataList(){
    //         return this.flightsData.flights.slice(
    //             (this.pageIndex - 1) * this.pageSize, 
    //             this.pageSize * this.pageIndex
    //         );
    //     }
    // },

    mounted(){

        // 请求机票列表的数据
        this.$axios({
            url: "/airs",
            method: "GET",
            params: this.$route.query
        }).then(res => {
            this.flightsData = res.data;
            // 总条数
            this.total = this.flightsData.flights.length;
            // 第一页的数据
            this.dataList = this.flightsData.flights.slice(0, this.pageSize);
        })
    },

    methods: {
        // 条数切换, value是当前选中的条数
        handleSizeChange(value){
            this.pageSize = value;
            // 根据页数切割当前数据
            this.setDataList();
        },

        // 页数的切换，value是选中的页数
        handleCurrentChange(value){
            this.pageIndex = value;
            // 根据页数切割当前数据
            this.setDataList();
        },

        setDataList(){
            // 根据页数切割当前数据
            this.dataList = this.flightsData.flights.slice(
                (this.pageIndex - 1) * this.pageSize, 
                this.pageSize * this.pageIndex
            );
        }
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>