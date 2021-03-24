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
                        <span class="rLabel" v-if="quotaType==5">住店车券库存剩余{{stockNum}}张</span>
                    </div>
                    <plateNumber @getPlateLicense="getPlateLicense" :noLabel='true' :clickOutside="true"></plateNumber>
                </el-form-item>
                <el-form-item class="elFormItem1">
                    <div class="formLabel">无车牌<span class="lLabel"><el-checkbox v-model="checked" @change="checkCarNum"></el-checkbox></span></div>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入电话号码" v-model="form.phone" :disabled="noCarNumStatus" type="tel" maxlength="11">
                        <!-- <template slot="prepend" class="preText">请输入电话号码：</template> -->
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
            labelWidth:'1.6rem',
            dialogShow:false,
            curSelectIndex:0,
            quotaList:[],
            moneyList:[10,30,50,100,300,"自定义"],
            timeList:[1,2,5,10,12,'自定义'],
            options:"",
            form:{
                licensePlate:"",
                phone:"",
                type:"",
                days:"",
                startTime:"",
                endTime:""
            },
            overDayTime: "",
            leaveTime: "",
            zdTime: "",
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
        ...mapGetters(["user",'merInfo'])
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
        this.form.quotaType = this.quotaType
        this.form.startTime = new Date()
        this.overDayTime = this.merInfo.overDayTime
        this.leaveTime = this.merInfo.leaveTime
        this.zdTime = this.merInfo.zdTime
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
            this.params.type = this.form.type
            this.params.days = this.form.days
            this.params.startTime = this.form.startTime
            this.params.endTime = this.form.endTime
            console.log(this.params,'onSubmit.params')
            if(this.form.quotaType==5){
                this.$api.business.addHotelQuota(this.params).then(res=>{
                    if(res.code == 200){
                        this.$router.go(-1)
                        this.$toast(res.message);
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }else{
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
    .issue{
        .formWrap{
            margin:.3rem;
            .elFormItem1{
                margin-bottom: 0;
                .lLabel{
                    margin-left:.1rem;
                }
                
            }
            /deep/ .el-input-group__prepend{
                color:#1989fa;
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
    /deep/ .inpNum{
        .el-input__inner{            
            text-align: left;
        }
    }
    .vanRadioGroup{
        margin-top:.1rem;
    }
</style>