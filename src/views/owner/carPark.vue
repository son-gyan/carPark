<template>
    <div>        
        <van-nav-bar class="navBar" title="附近车场" left-text="返回" left-arrow @click-left="onClickLeft" />
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