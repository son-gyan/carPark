<template>
    <div class="rechargePackage">
        <van-nav-bar class="navBar" title="充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-card class="vanCard">
                <template #title>
                    <p >用户名:12245687616</p>
                    <p > 
                        <span class="vanRadio">套餐：</span> 
                        <van-radio-group v-model="form.packageId" direction="horizontal" class="vanRadio">
                            <van-radio :name="item.id" v-for="(item,index) in packageList" :key="index" @click="radioClick(item)"> 
                                {{item.name}}
                            </van-radio>
                        </van-radio-group>
                    </p>
                    <p class="pFooter"  >
                        <span>订单金额：{{money}}</span>
                        <van-button class="fr" type="info" size="mini" @click="payBack">支付</van-button>
                    </p>
                </template>
            </van-card>
        </div>
    </div>              
</template>

<script>
import { mapGetters } from "vuex"
import config from "@/api/config";
export default {
    data() {
        return {
            params:{
                appId:""
            },
            packageList:[],
            money:0,
            form:{
                userId:"",
                packageId:""
            }
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created() {
        this.params.appId = config.appID  //  "wx09a13be6962ab9a8"//
        this.form.userId = this.user.id||localStorage.getItem('userId')
        this.getCzPagelist()
    },
    methods: {
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        // 获取车主套餐列表
        getCzPagelist(){
            this.$api.owner.getCzPagelist(this.params).then(res=>{
                if(res.code == 200){
                    //debugger
                    if(res.result.records&&res.result.records.length>0){
                        let rows = res.result.records;
                        this.packageList = rows
                    }
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
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
                formData.append("packageId",this.form.packageId)
                formData.append("userId",this.form.userId)
            this.$api.owner.vipPackagePay(formData).then(res => {
                if (res.code === 200) {
                    //debugger
                    window.location.href = res.result
                } else {
                    this.$toast('提示', `${res.message}`)
                }
            }).catch(error => {
                this.$toast('提示', `${error}`)
            })
        }
    },

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