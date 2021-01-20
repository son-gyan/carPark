<template>
    <div>
        <van-nav-bar class="navBar" title="会员充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">

        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    created(){

    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
    }
}
</script>