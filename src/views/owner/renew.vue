<template>
    <div>
        <van-nav-bar class="navBar" title="续费" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-card class="vanCard">
                <template #title>
                    <p >车场:{{carInfo.parkName}}</p>
                    <p >车牌:{{carInfo.licensePlate}}</p>
                    <p >套餐: 
                        <!-- <van-radio-group v-model="form.packageName" direction="horizontal" >
                            <van-radio :name="item.packageName" v-for="(item,index) in bindDisPacklist" :key="index" @click="radioClick(item)"> 
                                {{item.packageName}}
                            </van-radio>
                        </van-radio-group> -->
                    </p>
                    <p class="pFooter"  >
                        <span>订单金额:188</span>
                        <van-button class="fr" type="info" size="mini" @click="payBack(item)">支付</van-button>
                    </p>
                </template>
            </van-card> 
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return{            
            carInfo:{}
        }
    },
    created(){
        //debugger
        this.carInfo = this.$route.query.carInfo
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            //this.$router.go(-1)
            this.$router.push('/monthlyCar')
        },
        init(){

        },
        payBack(){

        }
    }
}
</script>


<style lang="less" scoped>
    body{
        #app{
            .child-view{
                display: inline-block;
                width: 100%;
                .mainWrap{
                    margin-bottom: 0;
                    background-color: #f2f2f2;
                }
            }
        }
    }
    
    .vanCard{
        display: inline-block;
        width: calc(100% - .6rem);
        margin: 0.3rem;
        padding: .3rem .2rem;
        background-color: #fff;
        font-size: .3rem;
        border-radius: .1rem;
        box-sizing: border-box;
        .fullWidth{
            width: 100%;
        }
        /deep/ .van-radio{
            flex: 1 1 45%;
            margin-bottom: .3rem;
        }
        .fr{
            float: right;
        }
    }
</style>