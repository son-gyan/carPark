<template>
    <div class="issue">
        <van-nav-bar class="navBar" :title="pageTit" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item label="券类型" :label-width="labelWidth">
                    <el-select v-model="form.id" placeholder="请选择券类型"  style="width: 100%;" @change="changeType">
                        <el-option :label="typeName(item)" :value="item.id" v-for="(item,index) in quotaList" :key="index" v-if="item.quotaType!=5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label-width="labelWidth">
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
import {timeFormate} from '@/utils'
export default {
    data(){
        return {
            pageTit:"",
            type:0,
            labelWidth:'1.6rem',//"2.3rem",
            quotaList:[],
            form:{
                stockNumber:"",
                merchantsId: "",
                quotData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: ""
            }
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        //this.form.merchantsId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.quotaList = this.$route.query.quotaInfo
        //debugger
        this.pageTit = "动态卷"
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
                    }
                }
            })
        },
        onSubmit(){
            console.log('onSubmit',this.form)
            if(this.form.quotaType==""){
                this.$toast("请选择券类型");
                return
            }else if(this.form.quotData ==""){
                this.$toast("券面值不能为空");
                return
            }
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