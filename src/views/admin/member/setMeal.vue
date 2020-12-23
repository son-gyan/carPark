<template>
    <div>
        <van-nav-bar class="navBar" title="套餐管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            套餐管理
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            count: 0
        }
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        load () {
            this.count += 2
        }
    }
}
</script>