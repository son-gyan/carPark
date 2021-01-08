<template>
    <div class="issue">
        <van-nav-bar class="navBar" :title="pageTit" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain qrCode">
            <el-row class="qrCodeForm" style="text-align:center">
                <el-col :span="24" class="pH">
                    <span v-if="dialogData.quotaType==1">定额优惠券</span>
                    <span v-if="dialogData.quotaType==2">时长优惠券</span>
                    <span v-if="dialogData.quotaType==3">金额优惠券</span>
                    <span v-if="dialogData.quotaType==4">次券优惠券</span>
                </el-col>
                <el-col :span="24"><van-image width="200" height="200" :src="dialogData.qrCodePng" /></el-col>
                <el-col :span="12" v-if="dialogData.quotaType==2">
                    <div class="grid-content bg-purple">
                        <p>优惠时间</p>
                        <p><el-link type="primary">{{dialogData.quotaData}}小时</el-link></p>
                    </div>
                </el-col>
                <el-col :span="12" v-if="dialogData.quotaType==1||dialogData.quotaType==3">
                    <div class="grid-content bg-purple">
                        <p>优惠金额</p>
                        <p><el-link type="primary">{{dialogData.quotaData}}元</el-link></p>
                    </div>
                </el-col>
                <el-col :span="dialogData.quotaType==4?24:12">
                    <div class="grid-content bg-purple-light">
                        <p>剩余张数</p>
                        <p><el-link type="primary">{{dialogData.quotaNum}}张</el-link></p>
                    </div>
                </el-col>
                <el-col :span="24">
                    <van-divider dashed class="vanDivider"></van-divider>
                </el-col>
                <el-col :span="24">
                    <p class="pF">领取说明:请使用微信扫一扫领取停车优惠券</p> 
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            pageTit:"",
            form:{},
            dialogData:{
                qrCodePng: "",
                quotaData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: ""
            },
            timer:''
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        //this.form.merchantsId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.form = this.$route.query.form
        //debugger
        this.pageTit = "动态卷"
        this.init()
        this.timer = setInterval(() => {
            this.init()
        }, 60000);
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.$api.business.addAutomaticQuota(this.form).then(res=>{
                //debugger
                if(res.code == 200){
                    this.dialogData = res.result
                    this.dialogData.qrCodePng = 'data:image/png;base64,'+res.result.qrCodePng
                    //this.$toast(res.message);
                    this.dialogVisible = true
                }else{
                    this.$toast(res.message);
                }
            })
        }
    },
    beforeDestroy(){
        clearInterval(this.timer);　　// 清除定时器
        this.timer = null;
    },
}
</script>
<style lang="less" scoped>
.qrCode{
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
    .qrCodeForm{
        width: 90%;
        margin:.3rem auto;
        .vanDivider{
            color:#222;
            border-color:#222;
        }
    }
</style>