<template>
    <div class="issue">
        <van-nav-bar class="navBar" title="填写券信息" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item class="verticalShow">
                    <div slot="label" class="formLabel">请输入车牌
                        <span class="rLabel" v-if="quotaType==3">金额券库存剩余{{quotaData}}元</span>
                        <span class="rLabel" v-if="quotaType==2">时长券库存剩余{{quotaData}}时</span>
                        <span class="rLabel" v-if="quotaType==4">次券库存剩余{{stockNum}}张</span>
                        <span class="rLabel" v-if="quotaType==1">定额券库存剩余{{stockNum}}张</span>
                    </div>
                    <plateNumber @getPlateLicense="getPlateLicense" :noLabel='true' :clickOutside="true"></plateNumber>
                </el-form-item>
                <el-form-item class="elFormItem1">
                    <div class="formLabel">无车牌<span class="lLabel"><el-checkbox v-model="checked" @change="checkCarNum"></el-checkbox></span></div>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入电话号码" v-model="form.phone" :disabled="noCarNumStatus" type="tel" maxlength="11">
                        <template slot="prepend">请输入电话号码：</template>
                    </el-input>
                </el-form-item>
                <el-form-item class="verticalShow" >
                    <div class="formLabel" v-if="showNote">停车时长：{{noteTime}} <span class="rLabel">应缴费：{{noteMoney}}元</span> </div>
                    <div class="formLabel" v-else>车辆不在车场</div>
                </el-form-item>
                <el-form-item class="verticalShow" v-if="quotaType==3">
                    <div slot="label" class="formLabel">请选择金额/元</div>
                    <van-grid :column-num="3" gutter="20" >
                        <van-grid-item  :text="item=='自定义'?item:item+'元'"  v-for="(item,index) in moneyList" :key="index" :data-num="item"
                            @click="selectMoney(index,$event)" :class="['vanGridItem',{selectedColor:index==curSelectIndex}]"/>
                    </van-grid>
                </el-form-item>
                <el-form-item class="verticalShow" v-if="quotaType==1">
                    <div slot="label" class="formLabel">请选择金额/元</div>
                    <van-grid :column-num="3" gutter="20">
                        <van-grid-item  :text="item.quotaData"  v-for="(item,index) in quotaList" :key="index" :data-num="item"
                            @click="selectQuota(index,$event)" :class="['vanGridItem',{selectedColor:index==curSelectIndex}]"/>
                    </van-grid>
                </el-form-item>
                <el-form-item class="verticalShow" v-if="quotaType==2">
                    <div slot="label" class="formLabel">请选择时长/时</div>
                    <van-grid :column-num="3" gutter="20" >
                        <van-grid-item  :text="item=='自定义'?item:item+'小时'"  v-for="(item,index) in timeList" :key="index"
                            @click="selectMoney(index,$event)" :class="['vanGridItem',{selectedColor:index==curSelectIndex}]"/>
                    </van-grid>
                </el-form-item>
                <el-form-item size="small" style="text-align:center;margin-top:20px">
                    <el-button round type="primary" @click="onSubmit" class="btnIssue">确认</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 弹框 -->
        <div class="covers" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{quotaType==3?'自定义金额':'自定义时长'}}</header>
                <main>
                    <el-form class="dialogForm">
                        <el-form-item v-if='quotaType==3'>
                            <el-input placeholder="请输入金额" v-model="dialogForm.moneyTime"></el-input>
                        </el-form-item>
                        <el-form-item v-if='quotaType==2'>
                            <el-input placeholder="请输入时长" v-model="dialogForm.moneyTime"></el-input>
                        </el-form-item>
                        <el-form-item size="small" style="text-align:center;margin-top:20px">
                            <el-button type="primary" @click="onSubmitDialog">确认</el-button>
                            <el-button type="default" @click="cancleHandle(quotaType)">取消</el-button>
                        </el-form-item>
                    </el-form>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import plateNumber from '@/components/plateNumber'
import { mapGetters } from "vuex"
import {dateCalculation} from '@/utils'
export default {
    components: {
        plateNumber
    },
    data(){
        return {
            dialogShow:false,
            curSelectIndex:0,
            quotaList:[],
            moneyList:[10,30,50,100,300,"自定义"],
            timeList:[1,2,5,10,12,'自定义'],
            options:"",
            form:{
                licensePlate:"",
                phone:"",
            },
            dialogForm:{
                moneyTime:""
            },
            quotaType:"",
            stockNum:0,
            quotaData:0,
            noCarNumStatus:true,
            params:{
                carNum: "",
                merchantsId: "",
                quotData: "",
                quotaName: "",
                quotaNum: 1,
                quotaType: ""
            },
            showNote:false,
            noteMoney:"",
            noteTime:""
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        this.quotaType = Number(this.$route.query.quotaType)
        this.stockNum = Number(this.$route.query.stockNum)||0
        this.quotaData = Number(this.$route.query.quotaData)||0
        this.params.merchantsId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.params.quotaType = this.quotaType
        if(this.quotaType==1){
            this.quotaList = this.$route.query.quotaInfo
            this.params.quotData = this.quotaList[0].quotaData
            this.params.quotaName = this.quotaList[0].quotaName
        }else if(this.quotaType==2){
            this.params.quotData = this.timeList[0]
        }else if(this.quotaType==3){
            this.params.quotData = this.moneyList[0]
        }
    },
    methods: {
        getPlateLicense(data){
            console.log('组件传出的data',data)
            this.form.licensePlate = data
            if(data.length>6){
                let pram = {
                    carNum:data,
                    merId:this.params.merchantsId
                }
                this.$api.business.checkCarMoney(pram).then(res=>{
                    //debugger
                    if(res.code == 0){
                        this.noteTime = dateCalculation(res.result.time)
                        this.noteMoney = res.result.money
                        this.showNote = true
                        //this.$toast(res.message);
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        selectMoney(index,event){
            this.curSelectIndex=index
            //获取点击对象     
            let el = event.currentTarget;
            this.options = el.innerText
            if(this.quotaType==2){
                this.params.quotData = this.timeList[index]
            }else{
                this.params.quotData = this.moneyList[index]
            }
            if(this.options == "自定义"){
                this.dialogShow = true
                this.dialogForm.moneyTime = ""
            }
        },
        selectQuota(index,event){
            this.curSelectIndex=index
            //获取点击对象     
            let el = event.currentTarget;
            this.options = el.innerText
            this.params.quotData = this.quotaList[index].quotaData
            this.params.quotaName = this.options
            //debugger
        },
        onSubmitDialog(quotaType){
            this.params.quotData = this.dialogForm.moneyTime
            this.dialogShow = false
        },
        cancleHandle(){
            this.dialogForm.moneyTime = ""
            this.dialogShow = false
        },
        checkCarNum(val){
            if(val){
                this.noCarNumStatus = false
            }else{
                this.noCarNumStatus = true
                this.form.phone = ""
            }
        },
        onSubmit(){
            if(this.noCarNumStatus){                
                this.params.carNum = this.form.licensePlate
            }else{
                this.params.carNum = this.form.phone
            }            
            console.log(this.params,'this.params')
            if(this.params.carNum==""){
                this.$toast("请填写车牌号或手机号");
                return
            }
            this.$api.business.addDirectionalQuota(this.params).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .issue{
        .formWrap{
            margin:.3rem;
            .elFormItem1{
                margin-bottom: 0;
                .lLabel{
                    margin-left:.1rem;
                }
            }
            .verticalShow{
                margin-bottom: 10px;
                /deep/ .el-form-item__label{
                    width: 100% !important;
                }
                /deep/ .el-form-item__content{
                    display: inline-block;
                    width: 100% ;
                    margin-left:0 !important;
                }
                .formLabel{
                    width: 100%;
                    font-size: 0.3rem;
                    padding-bottom: 0;
                    text-align: left;                    
                    .rLabel{
                        font-size:.2rem;
                        float: right;
                    }
                }
            }
            /deep/ .el-input-group__prepend{
                padding: 0 8px;
            }
            /deep/ .van-grid-item__content--center{
                background-color: #fff;
            }
            .selectedColor{
                /deep/ .van-grid-item__content--center{
                    background-color: #1989fa;
                    color:#fff;
                    .van-grid-item__text{
                        color:#fff;
                    }
                }
            }
            .btnIssue{
                width: 3rem;
            }
        }
        /deep/ .wrap{
            padding-left:0;
            padding-right:0;
            background-color: transparent;
            .num-box{
                width: 100%;
            }
        }
    }
    .dialogForm{
        margin: .3rem;
    }
</style>