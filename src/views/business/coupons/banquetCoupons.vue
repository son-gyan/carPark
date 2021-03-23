<template>
    <div class="issue">
        <van-nav-bar class="navBar" :title="pageTit" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item label="券类型" :label-width="labelWidth">
                    <el-select v-model="form.quotaType" placeholder="请选择券类型"  style="width: 100%;" @change="changeType">
                        <el-option label="时长券" :value="2"></el-option>
                        <el-option label="金额券" :value="3"></el-option>
                        <el-option label="次券" :value="4"></el-option>
                        <el-option label="定额券" :value="1"></el-option>
                        <el-option label="住店车券" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label-width="labelWidth" v-if="form.quotaType==5">
                    <div slot="label" class="formLabel">
                        开房类型
                    </div>
                    <van-radio-group v-model="form.type" direction="horizontal" class="vanRadioGroup" @change="batchType">
                        <van-radio :name="0">住点车</van-radio>
                        <van-radio :name="1">钟点房</van-radio>
                    </van-radio-group>
                </el-form-item>
                <el-form-item label="开房天数" :label-width="labelWidth" v-if="form.quotaType==5&&form.type==0">
                    <el-input-number v-model="form.days" controls-position="right" @change="dayChange" :min="1" :max="500" class="fullWidth inpNum"></el-input-number>
                </el-form-item>
                
                <el-form-item label="张数" :label-width="labelWidth">
                    <el-input v-model="form.quotaNum" placeholder="请输入张数"></el-input>
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
                <el-form-item label="失效时间"  :label-width="labelWidth"  v-if="form.quotaType!=5">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="form.invalidTime" 
                        format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始日期" :label-width="labelWidth" v-if="form.quotaType==5">
                    <el-date-picker
                        class="fullWidth"
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        @change="startChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" :label-width="labelWidth" v-if="form.quotaType==5">
                    <el-date-picker
                        class="fullWidth"
                        v-model="form.endTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择结束日期"
                        :disabled="true">
                    </el-date-picker>
                </el-form-item>
                <el-form-item size="small" style="text-align:center;"  label-width="0">
                    <el-button round type="primary" @click="onSubmit">{{type==1?'生成二维码':'生成优惠券'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="dialogTit" :visible.sync="dialogVisible" class="dialog" center width="90%">
            <el-row  style="text-align:center">
                <el-col :span="24" class="pH">
                    <span v-if="dialogData.quotaType==1">定额优惠券</span>
                    <span v-if="dialogData.quotaType==2">时长优惠券</span>
                    <span v-if="dialogData.quotaType==3">金额优惠券</span>
                    <span v-if="dialogData.quotaType==4">次券优惠券</span>
                    <span v-if="dialogData.quotaType==5">住店车券</span>
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
                        <p>优惠券张数</p>
                        <p><el-link type="primary">{{dialogData.quotaNum}}张</el-link></p>
                    </div>
                </el-col>
                <el-col :span="24">
                    <van-divider dashed style="color:#222;border-color:#222;"></van-divider>
                </el-col>
                <el-col :span="24">
                    <el-button type="primary" size="mini" @click="saveQrcode">保存二维码</el-button>
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
                invalidTime: timeFormate(new Date()),
                type:"",
                days:"",
                startTime:"",
                endTime:""
            },
            overDayTime: "",
            leaveTime: "",
            zdTime: "",
            dialogTit:"宴会券",
            dialogVisible:false,
            dialogData:{
                qrCodePng: "",
                quotaData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: ""
            }
        }
    },
    computed: {
        ...mapGetters(["user",'merInfo'])
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
        this.form.startTime = new Date()
        this.overDayTime = this.merInfo.overDayTime
        this.leaveTime = this.merInfo.leaveTime
        this.zdTime = this.merInfo.zdTime
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        changeType(val){
            this.form.quotaName = ""
            this.form.quotData = ""
            this.form.quotaNum = ""
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
        dayChange(){
            /* if (this.form.type==0 && this.form.startTime && this.form.days && this.overDayTime && this.zdTime) { */
            if (this.form.type!=="" && this.form.startTime && this.form.days && this.overDayTime && this.zdTime) {
                if (+this.form.type === 0) {
                    let dd = new Date(this.form.startTime)
                    let ddstar = dd.getFullYear() + '-' + this.p((dd.getMonth() + 1)) + '-' + this.p(dd.getDate())
                    let ddend = this.p(dd.getHours()) + ':' + this.p(dd.getMinutes()) + ':' + this.p(dd.getSeconds())
                    let startTime = ddstar + ' ' + ddend
                    let str = startTime.split(' ')[0]
                    let bijiaoStart = startTime.split(' ')[1]
                    let startArr = bijiaoStart.split(':')
                    let startTotal = 0
                    for (let i = 0; i < startArr.length; i++) {
                        if (i === 0) {
                            startTotal = startTotal + Number(startArr[0] * 3600)
                        } else if (i === 1) {
                            startTotal = startTotal + Number(startArr[1] * 60)
                        } else if (i === 2) {
                            startTotal = startTotal + Number(startArr[2])
                        }
                    }
                    let guoTotal = 0
                    let guoArr = this.overDayTime.split(':')

                    for (let j = 0; j < this.overDayTime.length; j++) {
                        if (j === 0) {
                            guoTotal = guoTotal + Number(guoArr[0] * 3600)
                        } else if (j === 1) {
                            guoTotal = guoTotal + Number(guoArr[1] * 60)
                        } else if (j === 2) {
                            guoTotal = guoTotal + Number(guoArr[2])
                        }
                    }
                    if (startTotal < guoTotal) {
                        let ggg = str + ' ' + this.leaveTime
                        let hhdh = new Date(ggg).getTime()
                        let cuoo = hhdh + (86400000 * (this.form.days - 1))
                        let cuozhuanbiaodd = this.getYMDHMS(cuoo)
                        this.form.endTime = cuozhuanbiaodd
                    } else if (startTotal >= guoTotal) {
                        let gggg = str + ' ' + this.leaveTime
                        let hhh = new Date(gggg).getTime()
                        let cuo = hhh + (86400000 * (this.form.days))
                        let cuozhuanbiao = this.getYMDHMS(cuo)
                        this.form.endTime = cuozhuanbiao
                    }
                }
            }
        },
        startChange(){
            if (this.form.type!=="" && this.form.startTime && this.form.days && this.overDayTime) {
                if (+this.form.type === 0) {
                    let dd = new Date(this.form.startTime)
                    let ddstar = dd.getFullYear() + '-' + this.p((dd.getMonth() + 1)) + '-' + this.p(dd.getDate())
                    let ddend = this.p(dd.getHours()) + ':' + this.p(dd.getMinutes()) + ':' + this.p(dd.getSeconds())
                    let startTime = ddstar + ' ' + ddend
                    let str = startTime.split(' ')[0]
                    let bijiaoStart = startTime.split(' ')[1]
                    let startArr = bijiaoStart.split(':')
                    let startTotal = 0
                    for (let i = 0; i < startArr.length; i++) {
                        if (i === 0) {
                            startTotal = startTotal + Number(startArr[0] * 3600)
                        } else if (i === 1) {
                            startTotal = startTotal + Number(startArr[1] * 60)
                        } else if (i === 2) {
                            startTotal = startTotal + Number(startArr[2])
                        }
                    }
                    let guoTotal = 0
                    let guoArr = this.overDayTime.split(':')
                    for (let j = 0; j < this.overDayTime.length; j++) {
                        if (j === 0) {
                            guoTotal = guoTotal + Number(guoArr[0] * 3600)
                        } else if (j === 1) {
                            guoTotal = guoTotal + Number(guoArr[1] * 60)
                        } else if (j === 2) {
                            guoTotal = guoTotal + Number(guoArr[2])
                        }
                    }
                    if (startTotal < guoTotal) {
                        let ggg = str + ' ' + this.leaveTime
                        let hhdh = new Date(ggg).getTime()
                        let cuoo = hhdh + (86400000 * (this.form.days - 1))
                        let cuozhuanbiaodd = this.getYMDHMS(cuoo)
                        this.form.endTime = cuozhuanbiaodd
                    } else if (startTotal >= guoTotal) {
                        let gggg = str + ' ' + this.leaveTime
                        let hhh = new Date(gggg).getTime()
                        let cuo = hhh + (86400000 * (this.form.days))
                        let cuozhuanbiao = this.getYMDHMS(cuo)
                        this.form.endTime = cuozhuanbiao
                    }
                } else if (+this.form.type === 1) {
                    let fdsdfs = new Date(this.form.startTime).getTime()
                    let fdfew = fdsdfs + Number(this.zdTime * 3600000)
                    let dsfs = this.getYMDHMS(fdfew)
                    this.form.endTime = dsfs
                }
            }
        },
        batchType(obj){
            if (this.form.type!=="" && this.form.startTime && this.form.days && this.overDayTime) {
                if (+obj === 0) {
                    let dd = new Date(this.form.startTime)
                    let ddstar = dd.getFullYear() + '-' + this.p((dd.getMonth() + 1)) + '-' + this.p(dd.getDate())
                    let ddend = this.p(dd.getHours()) + ':' + this.p(dd.getMinutes()) + ':' + this.p(dd.getSeconds())
                    let startTime = ddstar + ' ' + ddend
                    let str = startTime.split(' ')[0]
                    let bijiaoStart = startTime.split(' ')[1]
                    let startArr = bijiaoStart.split(':')
                    let startTotal = 0
                    for (let i = 0; i < startArr.length; i++) {
                        if (i === 0) {
                            startTotal = startTotal + Number(startArr[0] * 3600)
                        } else if (i === 1) {
                            startTotal = startTotal + Number(startArr[1] * 60)
                        } else if (i === 2) {
                            startTotal = startTotal + Number(startArr[2])
                        }
                    }
                    let guoTotal = 0
                    let guoArr = this.overDayTime.split(':')
                    for (let j = 0; j < this.overDayTime.length; j++) {
                        if (j === 0) {
                            guoTotal = guoTotal + Number(guoArr[0] * 3600)
                        } else if (j === 1) {
                            guoTotal = guoTotal + Number(guoArr[1] * 60)
                        } else if (j === 2) {
                            guoTotal = guoTotal + Number(guoArr[2])
                        }
                    }
                    if (startTotal < guoTotal) {
                        let ggg = str + ' ' + this.leaveTime
                        let hhdh = new Date(ggg).getTime()
                        let cuoo = hhdh + (86400000 * (this.form.days - 1))
                        let cuozhuanbiaodd = this.getYMDHMS(cuoo)
                        this.form.endTime = cuozhuanbiaodd
                    } else if (startTotal >= guoTotal) {
                        let gggg = str + ' ' + this.leaveTime
                        let hhh = new Date(gggg).getTime()
                        let cuo = hhh + (86400000 * (this.form.days))
                        let cuozhuanbiao = this.getYMDHMS(cuo)
                        this.form.endTime = cuozhuanbiao
                    }
                } else if (+this.form.type === 1) {
                    let fdsdfs = new Date(this.form.startTime).getTime()
                    let fdfew = fdsdfs + Number(this.zdTime * 3600000)
                    let dsfs = this.getYMDHMS(fdfew)
                    this.form.endTime = dsfs
                }
            }
        },
        onSubmit(){
            if(this.form.quotaType==""){
                this.$toast("请选择券类型");
                return
            }else if(this.form.quotaNum==""){
                this.$toast("缺少张数");
                return
            }
            if(this.form.quotaType==5){
                if(this.form.type===""){
                    this.$toast("请选择开房类型");
                    return
                }else if(!this.form.days){
                    this.$toast("请输入开房天数");
                    return
                }else if(!this.form.startTime){
                    this.$toast("请选择开始日期");
                    return
                }
            }
            let dd = new Date(this.form.startTime)
            let ddstar = dd.getFullYear() + '-' + this.p((dd.getMonth() + 1)) + '-' + this.p(dd.getDate())
            let ddend = this.p(dd.getHours()) + ':' + this.p(dd.getMinutes()) + ':' + this.p(dd.getSeconds())
            let startTime = ddstar + ' ' + ddend
            this.form.startTime = startTime
            
            console.log('onSubmit',this.form)

            if(this.type==1){
                this.$api.business.addBanquetQuota(this.form).then(res=>{
                    if(res.code == 200){
                        this.dialogData = res.result
                        this.dialogData.qrCodePng = 'data:image/png;base64,'+res.result.qrCodePng
                        //this.$toast(res.message);
                        this.dialogVisible = true
                    }else{
                        this.$toast(res.message);
                    }
                })
            }else if(this.type==2){
                this.$api.business.addBatchQuota(this.form).then(res=>{
                    debugger
                    if(res.code == 200){
                        this.$toast(res.message);
                        window.location.href = res.result.pdfPath
                    }else{
                        this.$toast(res.message);
                    }
                })
            }
        },
        dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        saveQrcode(){
            var myBlob = this.dataURLtoBlob(this.dialogData.qrCodePng)
            var myUrl = URL.createObjectURL(myBlob)
            this.downloadFile(myUrl)
        },
        downloadFile(url){
            var a = document.createElement("a")
            a.setAttribute("href",url)
            a.setAttribute("target","_blank")
            let clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", true, true);
            a.dispatchEvent(clickEvent);
        },
        getYMDHMS (timestamp) {
            let time = new Date(timestamp)
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let date = time.getDate()
            let hours = time.getHours()
            let minute = time.getMinutes()
            let second = time.getSeconds()

            if (month < 10) { month = '0' + month }
            if (date < 10) { date = '0' + date }
            if (hours < 10) { hours = '0' + hours }
            if (minute < 10) { minute = '0' + minute }
            if (second < 10) { second = '0' + second }
            return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
        },
        p (s) {
            return s < 10 ? '0' + s : s
        },
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
    /deep/ .inpNum{
        .el-input__inner{            
            text-align: left;
        }
    }
    .vanRadioGroup{
        margin-top:.1rem;
    }
</style>