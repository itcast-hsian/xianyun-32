<template>
  <div>
     组件递归


  </div>
</template>

<script>

export default {
  data(){
      return {
          navs: [
            {
                title: "衣服",
                children: [
                    { 
                        title: "男装",
                        children: [
                            { 
                                title: "T恤",
                                children: [ {title: "短袖"}, { title: "长袖" } ]
                            }
                        ]
                    },
                    { 
                        title: "女装",
                        children: [
                            {
                                title: "裙子",
                                children: [
                                    { title: "连衣裙" },
                                    { title: "短裙" }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                title: "电器",
                children: [
                    { title: "电视", children: [
                        { title: "液晶电视" },
                        { title: "普通电视"}
                    ] },
                    { title: "冰箱" },
                    { title: "空调" },
                ]
            }

          ]
      }
  }
}
</script>

<style>

</style>
