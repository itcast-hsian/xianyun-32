<template>
    <div class="div">
        <div v-for="(item, index) in  data" :key="index">
            {{ item.title }}

            <!-- 自己调用自己 -->
            <NavsItem :data="item.children" />
        </div>
    </div>
</template>

<script>
export default {
    // 1.先命名name, 在当前组件内可以通过name自己调用自己
    name: "NavsItem",
    props: ["data"]
}
</script>

<style scoped>
    .div  div{
        margin-left:20px;
    }
</style>
