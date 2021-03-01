<template>
    <div>
        <van-nav-bar class="navBar" title="续费" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-card class="vanCard">
                <template #title>
                    <p >车场：{{carInfo.parkName}}</p>
                    <p >车牌：{{carInfo.licensePlate}}</p>
                    <p > <span class="vanRadio">套餐：</span> 
                        <van-radio-group v-model="form.packageId" direction="horizontal" class="vanRadio">
                            <van-radio :name="item.id" v-for="(item,index) in carInfo.packageList" :key="index" @click="radioClick(item)"> 
                                {{item.name}}
                            </van-radio>
                        </van-radio-group>
                    </p>
                    <p class="pFooter"  >
                        <span>订单金额：{{money}}</span>
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
            carInfo:{},
            form:{
                channel:"weixin",
                packageId:"",
                veId:""
            },
            money:0
        }
    },
    created(){
        //debugger
        this.carInfo = this.$route.query.carInfo
        this.form.veId = this.carInfo.id
    },
    methods:{
        //返回
        onClickLeft(){
            //this.$router.go(-1)
            this.$router.push('/monthlyCar')
        },
        radioClick(item){
            this.money = item.price
        },
        payBack(){  //packagePay
            if(this.form.packageId==""){
                this.$toast('请选择套餐')
                return
            }
            let formData = new FormData()
                formData.append("channel",this.form.channel)
                formData.append("packageId",this.form.packageId)
                formData.append("veId",this.form.veId)
            this.$api.owner.packagePay(formData).then(res => {
                if (res.code === 200) {
                    window.location.href = res.result
                } else {
                    this.$toast('提示', `${res.message}`)
                }
            }).catch(error => {
                this.$toast('提示', `${error}`)
            })
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
        /* display: inline-block;
        width: calc(100% - .6rem);
        margin: 0.3rem; */
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
        .vanRadio{
            display: inline-block;
        }
    }
</style>