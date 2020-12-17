<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="联系我们" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="contact">
            <div class="info">                
                <h3>专业团队 为您服务</h3>
                <img class="img" src="@/assets/images/owner/jiantou.png" alt="" srcset="">
                <h3 class="hBlue">联系我们</h3>
                <h3 class="hBlue">咨询热线:0717 - 6909 269</h3>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        onClickLeft(){
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="less" scoped>
    .pages{
        height: 100%;
    }
    .contact{
        display: inline-block;
        width:100% ;
        height:calc(100% - 49px);
        background: url("../../assets/images/owner/contactBg.png") center no-repeat;
        background-size: cover;
        text-align: center;
        .info{
            margin-top:6.5rem;
            h3{
                font-size: .5rem;
                margin-bottom: .5rem;
            }
            .img{
                width: 2rem;
            }
        }
        .hBlue{
            color:#0057C8;
        }
    }
</style>