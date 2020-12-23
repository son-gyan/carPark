<template>
    <div>
        <van-nav-bar class="navBar" title="会员管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-main class="elMain">
                <van-grid :gutter="0" :column-num="3" class="gridGroup" :border="false">
                    <van-grid-item  text="套餐管理" @click='jumpTo(1)'  :icon="require('../../assets/images/admin/setMeal.png')"/>
                    <van-grid-item  text="用户管理" @click='jumpTo(2)'  :icon="require('../../assets/images/admin/user.png')"/>
                    <van-grid-item  text="消费记录" @click='jumpTo(3)'  :icon="require('../../assets/images/admin/consume.png')"/>
                    <van-grid-item  text="充值记录" @click='jumpTo(4)'  :icon="require('../../assets/images/admin/recharge.png')"/>
                    <van-grid-item  text="会费收入" @click='jumpTo(5)'  :icon="require('../../assets/images/admin/dues.png')"/>
                    <van-grid-item  text="项目绑定" @click='jumpTo(6)'  :icon="require('../../assets/images/admin/project.png')"/>
                </van-grid>
            </el-main>
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
        jumpTo(type){
            switch (type) {
                case 1:
                    this.$router.push('/setMeal')
                    break;
                case 2:
                    this.$router.push('/user')
                    break;
                case 3:
                    this.$router.push('/consume')
                    break;
                case 4:
                    this.$router.push('/recharge')
                    break;
                case 5:
                    this.$router.push('/dues')
                    break;
                case 6:
                    this.$router.push('/project')
                    break;                
                default:
                    break;
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .fixedMain{
        text-align: center;
    }
    .elMain{
        display: inline-block;            
        width: 93%;
        margin: 20px auto;
        padding: 10px 0;
        background: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        .tit{
            font-size: .35rem;
            padding: 10px 0;
            text-align: center;
        }
        /deep/ .gridGroup{
            width: 93%;
            margin: 0 auto;
            .van-grid-item__icon {
                font-size: 1rem;
            }
            .van-grid-item__text{
                font-size: .3rem;
                font-weight: bold;
                text-align: center;
            }
            .van-grid-item__content{
                padding: 10px 8px;
            }
        }
        .vanGrid{
            margin-top:.1rem;
            /deep/.van-grid-item__content--center{
                height:2.3rem;
            }
        }
    }
</style>