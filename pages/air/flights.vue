<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters  :data="cacheFlightsData" @changeDataList="changeDataList"/>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item, index) in dataList" :key="index" :data="item" />

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
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <FlightsAside/>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue"
import FlightsAside from "@/components/air/flightsAside.vue"

export default {
  data() {
    return {
      flightsData: {
        flights: [ ],
        info: { },
        options: {}
      }, // 后台返回的所有数据

      // 缓存一份接口返回最初的数据，一旦赋值之后永远不能修改
      cacheFlightsData:  {
        flights: [ ],
        info: { },
        options: {}
      },

      pageIndex: 1, // 当前页数
      pageSize: 5, // 当前页面的条数
      total: 0 // 总条数
    };
  },

  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },

  computed: {
      // 当前页面渲染的列表数据
      dataList(){
          
          return this.flightsData.flights.slice(
              (this.pageIndex - 1) * this.pageSize,
              this.pageSize * this.pageIndex
          );
      }
  },

    // watch: {
    //     // 监听路由的变化,，同一个页面之间的跳转不会重新加载组件
    //     // 1.可以通过监听$route的方法来实现
    //     // 2.
    //     $route(){
    //        // console.log(123)
    //         this.getData();
    //     }
    // },

    beforeRouteUpdate (to, from, next) {
        next();
        this.getData();
    },

  mounted() {
      this.getData();
  },

  methods: {
      // 获取机票列表数据
      getData(){
           // 请求机票列表的数据
            this.$axios({
            url: "/airs",
            method: "GET",
            params: this.$route.query
            }).then(res => {
                // 大数据
                this.flightsData = res.data;

                //  和上面的值是一样的，只不过一旦被赋值之后，不能被修改
                this.cacheFlightsData =  { ...res.data};

                // 总条数
                this.total = this.flightsData.flights.length;
            });
      },

    // 条数切换, value是当前选中的条数
    handleSizeChange(value) {
      this.pageSize = value;
    },

    // 页数的切换，value是选中的页数
    handleCurrentChange(value) {
      this.pageIndex = value;
    },

    // 传递给子组件，用于修改dataList
    changeDataList( arr ){
        this.flightsData.flights = arr;
        this.total = this.flightsData.flights.length;
        this.pageIndex = 1;
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>