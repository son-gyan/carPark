<template>
    <div class="issue">
        <van-nav-bar class="navBar" :title="pageTit" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item label="券类型" :label-width="labelWidth">
                    <el-select v-model="form.quotaType" placeholder="请选择券类型"  style="width: 100%;">
                        <el-option label="时长券" :value="2"></el-option>
                        <el-option label="金额券" :value="3"></el-option>
                        <el-option label="次券" :value="4"></el-option>
                        <el-option label="定额券" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="券数量" :label-width="labelWidth">
                    <el-input v-model="form.quotaNum" placeholder="请输入券数量"></el-input>
                </el-form-item>
                <el-form-item label="券名称" v-if="form.quotaType==1"  :label-width="labelWidth">
                    <el-select v-model="form.quotaName" placeholder="请选择券名称"  style="width: 100%;" @change="changeName">
                        <el-option :label="item.quotaName" :value="item.quotaName" v-for="(item,index) in quotaList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠时长" v-if="form.quotaType==2"  :label-width="labelWidth">
                    <el-input v-model="form.quotData" placeholder="请输入时长"></el-input>
                </el-form-item>
                <el-form-item label="优惠金额" v-if="form.quotaType==3"  :label-width="labelWidth">
                    <el-input v-model="form.quotData" placeholder="请输入金额"></el-input>
                </el-form-item>
                <el-form-item label="失效时间"  :label-width="labelWidth">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="form.invalidTime" 
                        format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item size="small" style="text-align:center;"  label-width="0">
                    <el-button round type="primary" @click="onSubmit">{{type==1?'生成二维码':'生成优惠券'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="dialogTit" :visible.sync="dialogVisible" class="dialog" center width="90%">
            <el-row  style="text-align:center">
                <el-col :span="24" class="pH">时长优惠券</el-col>
                <el-col :span="24"><van-image width="200" height="200" :src="require('@/assets/images/business/coupons/erWeiCode.png')" /></el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <p>优惠时间</p>
                        <p><el-link type="primary">1小时</el-link></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                        <p>优惠券张数</p>
                        <p><el-link type="primary">1张</el-link></p>
                    </div>
                </el-col>
                <el-col :span="24">
                    <van-divider dashed style="color:#222;border-color:#222;"></van-divider>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" size="mini">保存二维码</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" size="mini">刷新二维码</el-button>
                </el-col>
                <el-col :span="24">
                    <p class="pF">领取说明:请使用微信扫一扫领取停车优惠券</p> 
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import {timeFormate} from '@/utils'
export default {
    data(){
        return {
            pageTit:"",
            type:0,
            labelWidth:"1.6rem",
            quotaList:[],
            form:{
                merchantsId: "",
                quotData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: "",
                invalidTime: timeFormate(new Date())
            },
            dialogTit:"宴会券",
            dialogVisible:false,
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        this.form.merchantsId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.quotaList = this.$route.query.quotaInfo
        this.type = this.$route.query.type
        if(this.type==1){
            this.pageTit = "宴会发券"
        }else if(this.type==2){
            this.pageTit = "纸质发券"
        }else if(this.type==3){
            this.pageTit = "动态卷"
        }
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        changeName(val){
            let element = []
            this.quotaList.map((item) => {
                //debugger
                if(item.quotaName==val){
                    this.form.quotData = item.quotaData
                }
            })
        },
        onSubmit(){
            console.log('onSubmit',this.form)
            if(this.form.quotaType==""){
                this.$toast("请选择券类型");
                return
            }else if(this.form.quotaNum==""){
                this.$toast("缺少数量");
                return
            }
            if(type==1){
                this.$api.business.addBanquetQuota(this.form).then(res=>{
                    if(res.code == 200){
                        this.$toast(res.message);
                        this.dialogVisible = true
                    }else{
                        this.$toast(res.message);
                    }
                })
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
.dialog{
    /deep/ .el-dialog__header{
        background-color: #1989fa;
        color: #fff;
        .el-dialog__title{
            color: #fff;
        }
        .el-dialog__headerbtn .el-dialog__close{
            color: #fff;
        }
    }
    .pH{
        margin-bottom:.2rem;
        font-size: .3rem;
    }
    .pF{
        font-size: .2rem;
        margin-top:.2rem;
    }
}
    .formWrap{
        width: 90%;
        margin:.3rem auto;
    }
</style>