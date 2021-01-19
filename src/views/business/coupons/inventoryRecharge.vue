<template>
    <div>
        <van-nav-bar class="navBar" title="库存充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" label-width="1.6rem" size="mini" class="formWrap">
                <el-form-item label-width="0.3rem">
                    <van-radio-group v-model="form.packageName" direction="horizontal" >
                        <van-radio :name="item.packageName" v-for="(item,index) in bindDisPacklist" :key="index" @click="radioClick(item)"> 
                            {{item.packageName}}
                            <span v-if="item.couponType==1">- 定额券</span> 
                            <span v-if="item.couponType==2">- 时长券</span> 
                            <span v-if="item.couponType==3">- 金额券</span> 
                            <span v-if="item.couponType==4">- 次券</span> 
                            <span v-if="item.couponType==5">- 住店车券</span> 
                        </van-radio>
                    </van-radio-group>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="form.unitPrice" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="充值总数">
                    <el-input v-model="form.sum" @input="inputChange" type="number"></el-input>
                </el-form-item>
                <el-form-item size="mini" style="text-align:center" label-width="0">
                    <el-button round type="primary" @click="handlePay">支付{{payMoney}}元</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            finished: false,
            loading: false,
            params:{
                depId:"",
                merId:""
            },
            bindDisPacklist:[],
            form:{
                packageName:"",
                unitPrice:"",
                sum:""
            },
            quotaData:0,
            couponType:"",
            unitPrice:"",
            sum:"",
            payMoney:0
        }
    },
    computed: {
        ...mapGetters(["user",'depId'])
    },
    created(){
        this.params.merId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.params.depId = this.depId||sessionStorage.getItem('depId')
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.$api.business.bindDisPacklist(this.params).then(res=>{
                //debugger
                if(res.code == 200){
                    this.bindDisPacklist = res.result
                }else{
                    this.$toast(res.message);
                }
            })
        },
        radioClick(item){
            this.payMoney = 0
            //this.form.sum = ""
            this.quotaData = item.originalMoney
            this.unitPrice = item.discounttaMoney
            this.couponType = item.couponType
            switch (item.couponType) {
                case 1:
                    this.form.unitPrice = item.discounttaMoney+"元/张"
                    break;
                case 2:
                    this.form.unitPrice = item.discounttaMoney+"元/小时"
                    break;
                case 3:
                    this.form.unitPrice = item.discounttaMoney+"折"
                    break;
                case 4:
                    this.form.unitPrice = item.discounttaMoney+"元/张"
                    break;
                case 5:
                    this.form.unitPrice = item.discounttaMoney+"元/张"
                    break;
            }
            if(this.sum !=""){
                if(this.couponType!=3){                
                    this.payMoney = this.sum*this.unitPrice
                }else{
                    this.payMoney = this.sum*this.unitPrice/100
                }
            }
        },
        inputChange(val){
            this.sum = val
            if(this.couponType!=3){                
                this.payMoney = val*this.unitPrice
            }else{
                this.payMoney = val*this.unitPrice/100
            }
        },
        handlePay(){
            if(this.couponType==""){
                this.$toast("请选择套餐");
                return
            }else if(this.sum==""){
                this.$toast("请输入充值总数");
                return
            }
            let params = {
                data:this.sum,
                merId:this.params.merId,
                money:this.payMoney,
                quotaData:this.quotaData,
                quotaName:this.form.packageName,
                type:this.couponType
            }
            let formData = new FormData();
                formData.append('data',params.data)
                formData.append('merId',params.merId)
                formData.append('money',params.money)
                formData.append('quotaData',params.quotaData)
                formData.append('quotaName',params.quotaName)
                formData.append('type',params.type)
            this.$api.business.quotaPackagePay(formData).then(res=>{
                debugger
                if(res.code == 200){
                    window.location.href = res.result
                }else{
                    this.$toast(res.message);
                }
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
    
    .formWrap{
        display: inline-block;
        width: calc(100% - .6rem);
        margin: 0.3rem;
        padding: .3rem .2rem;
        background-color: #fff;
        border-radius: .1rem;
        box-sizing: border-box;
        .fullWidth{
            width: 100%;
        }
        /deep/ .van-radio{
            flex: 1 1 45%;
            margin-bottom: .3rem;
        }
    }
</style>