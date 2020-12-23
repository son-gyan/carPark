<template>
    <div>
        <van-nav-bar class="navBar" title="消费记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            消费记录
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
    }
}
</script>