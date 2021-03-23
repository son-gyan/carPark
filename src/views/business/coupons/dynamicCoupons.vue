<template>
    <div class="issue">
        <van-nav-bar class="navBar" :title="pageTit" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item label="券类型" :label-width="labelWidth">
                    <el-select v-model="form.id" placeholder="请选择券类型" class="fullWidth" @change="changeType">
                        <el-option :label="typeName(item)" :value="item.id" v-for="(item,index) in quotaList" :key="index" ></el-option> <!-- v-if="item.quotaType!=5" -->
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
                    <!-- <el-select v-model="form.days" placeholder="请选择开房天数" class="fullWidth" >
                        <el-option :label="item" :value="item" v-for="(item,index) in 30" :key="index"></el-option>
                    </el-select> -->
                    <el-input-number v-model="form.days" controls-position="right" @change="dayChange" :min="1" :max="500" class="fullWidth inpNum"></el-input-number>
                </el-form-item>
                <el-form-item label="开始日期" :label-width="labelWidth" v-if="form.quotaType==5">
                    <el-date-picker
                        class="fullWidth"
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        @change="startChange"> <!-- format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" -->
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" :label-width="labelWidth" v-if="form.quotaType==5">
                    <!-- <el-input v-model="form.endTime" readonly></el-input> -->
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
                <el-form-item :label-width="labelWidth" v-if="form.quotaType!=5">
                    <div slot="label" class="formLabel">
                        券面值
                        <!-- <span v-if="form.quotaType==2">(小时)</span>
                        <span v-else>(元)</span> -->
                    </div>
                    <el-input v-model="form.quotData" :disabled="disableStatus"></el-input>
                </el-form-item>
                <el-form-item label="" :label-width="labelWidth">
                    <div slot="label" class="formLabel">
                        库存剩余
                    </div>
                    <el-input v-model="form.stockNumber" disabled="true"></el-input>
                </el-form-item>
                <el-form-item size="small" style="text-align:center;"  label-width="0">
                    <el-button round type="primary" @click="onSubmit">生成二维码</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="dialogTit" :visible.sync="dialogVisible" class="dialog" center width="90%">
            
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import {timeFormate,formatDate} from '@/utils'
export default {
    data(){
        return {
            pageTit:"",
            type:0,
            labelWidth:'1.6rem',//"2.3rem",
            quotaList:[],
            couponType:'',
            form:{
                stockNumber:"",
                merchantsId: "",
                quotData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: "",
                type:"",
                days:"",
                startTime:"",
                endTime:""
            },
            overDayTime: "",
            leaveTime: "",
            zdTime: ""
        }
    },
    computed: {
        ...mapGetters(["user",'merInfo'])
    },
    created(){
        //this.form.merchantsId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        let  str = this.$route.query.quotaInfo
        this.quotaList = JSON.parse(str)
        this.pageTit = "动态卷"
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
        typeName(item){
            switch (item.quotaType) {
                case 1:
                    return item.quotaName+"券"
                    break;
                case 2:
                    return "时长券"
                    break;
                case 3:
                    return "金额券"
                    break;
                case 4:
                    return "次券"
                    break;
                case 5:
                    return "住店车券"
                    break;
                default:
                    break;
            }
        },
        changeType(val){
            let element = ""
            this.quotaList.map((item) => {
                //debugger
                if(item.id==val){
                    this.form.merchantsId = item.merchantsId
                    this.form.quotaType = item.quotaType
                    if(item.quotaType==1){
                        this.disableStatus = true
                        this.form.quotData = item.quotaData
                        this.form.stockNumber = item.stockNum+'张'
                    }else if(item.quotaType==2){   
                        //this.form.quotaData = ""
                        this.form.stockNumber = ""
                        this.disableStatus = false                     
                        this.form.stockNumber = item.quotaData+'小时'
                    }else if(item.quotaType==3){    
                        //this.form.quotaData = ""
                        this.form.stockNumber = ""
                        this.disableStatus = false                    
                        this.form.stockNumber = item.quotaData+'元'
                    }else if(item.quotaType==4){ 
                        //this.form.quotaData = ""
                        this.form.stockNumber = ""
                        this.disableStatus = false                 
                        this.form.stockNumber = item.stockNum+'张'
                    }else if(item.quotaType==5){ 
                        //this.form.quotaData = ""
                        this.form.stockNumber = ""
                        this.disableStatus = false                 
                        this.form.stockNumber = item.stockNum+'张'
                    }
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
            }else if(this.form.quotaType!=5&&this.form.quotData ==""){
                this.$toast("券面值不能为空");
                return
            }
            //debugger
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
            this.$router.push({
                path:"/showQrCode",
                query:{
                    form:this.form
                }
            })
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