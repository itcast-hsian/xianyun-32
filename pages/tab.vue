<template>
    <div>
        <div class="ctrl">
            <span 
            v-for="(item, index) in ['新闻', '体育', '军事']"
            :key="index"
            @click="handleClick(index)"
            :class="{ active: current === index }">
                {{item}}
            </span>
        </div>

        <div v-if="current === 0">
            <ul>
                <li>宋仲基离婚</li>
                <li>宋仲基离婚</li>
                <li>宋仲基离婚</li>
            </ul>
        </div>
        <div v-if="current === 1">
            <ul>
                <li>蔡徐坤打篮球</li>
                <li>蔡徐坤打篮球</li>
                <li>蔡徐坤打篮球</li>
            </ul>
        </div>
        <div  v-if="current === 2">
            <ul>
                <li>落地98k</li>
                <li>落地98k</li>
                <li>落地98k</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            current: 0 // 默认的显示的状态，第一个
        }
    },

    methods: {
        handleClick(index){
            this.current = index;
        }
    }
}
</script>

<style>
    .ctrl{
        margin-bottom:10px;
    }

    .ctrl span{
        cursor: pointer;
        margin:0 10px;
    }

    .active{
        color:red;
    }
</style>
