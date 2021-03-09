<template>
    <div>
        <van-nav-bar class="navBar" title="我的月租车" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text=""
                @load="onLoad"
                :offset="10"
                >
                <div class="searchWrap">
                    <van-button type="info" size="mini" @click="apply">月租申请</van-button>
                </div>
                <van-card  class="vanCard" v-for="(item,index) in monthlyCarList" :key="index">
                    <template #title>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">{{item.parkName}}</van-col>
                            <van-col span="7">{{item.licensePlate}}</van-col>
                            <van-col span="3">
                                <van-button type="info" size="mini" @click="jumpPay(item)">续费</van-button>
                            </van-col>
                        </van-row>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">到期时间：{{item.endTime}}</van-col>
                            <van-col span="7">{{getDayNum(item.endTime)>0?'剩余'+getDayNum(item.endTime)+'天':"过期"}}</van-col>
                            <van-col span="3">
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <div class="noSearch" v-if="monthlyCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers mycarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main class="dialogMain">
                    <el-form ref="form" :model="form" label-width="70px" size="mini">
                        <el-form-item label="车场：">
                            <el-select v-model="form.parkId" placeholder="请选择车场" class="fullWidth" @change="onChangeSelect">
                                <el-option :label="item.name" :value="item.id" v-for="item in carParkList" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="carNum">
                            <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                        </div>
                        <el-form-item label="姓名：">
                            <el-input v-model="form.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="住址：">
                            <el-input v-model="form.userAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="电话：">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <div class="uploadWrap">
                            <el-upload
                                class="avatar-uploader"
                                action="string"
                                accept="image/*"
                                :show-file-list="false"
                                :before-upload="beforeUpload"
                                :on-change="handleChange"
                                :on-preview="handlePictureCardPreview"
                                :auto-upload="false"
                                > <!--  -->
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button @click="cancleHandle">取消</el-button>
                        </el-form-item>
                    </el-form>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
import ClickOutside from 'element-ui/src/utils/clickoutside'
import plateNumber from '@/components/plateNumber'
import {getDayNum,compress } from '@/utils'
import * as imageConversion from 'image-conversion';
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
        plateNumber
    },
    data(){
        return {
            searchVal:"",
            finished: false,
            loading: false,
            carParkList:[],
            monthlyCarList:[],
            params:{
                userId:""
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"月租申请",
            form:{
                depId:"",
                parkId:"",
                carNum:"",
                userName:"",
                userAddress:"",
                phone:"",
                file:''
            },
            imageUrl:"",
            dialogVisible:false
        }
    },
    directives: { ClickOutside },
    computed: {
        ...mapGetters(['user'])
    },
    created(){
        this.params.userId = this.user.id||sessionStorage.getItem('userId')
        this.init()
        this.getCarList()
        /* let dayNum = getDayNum("2020-12-24")
        console.log(dayNum,"dayNum") */
    },
    methods:{
        getDayNum:getDayNum,
        getPlateLicense(data){
            this.form.carNum = data
        },
        //返回
        onClickLeft(){
            this.$router.push('/indexOwner')
        },
        getCarList(){
            this.$api.owner.getCarList().then(res=>{
                if(res.code == 200){
                    let rows = res.result; //请求返回当页的列表
                    this.carParkList = rows
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        init(){
            this.$api.owner.getMonthlyCarList(this.params).then(res=>{
                if(res.code == 200){
                    //debugger
                    let rows = res.result; //请求返回当页的列表
                    this.monthlyCarList = rows
                    this.finished = true
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        apply(){
            this.dialogShow = true
        },
        jumpPay(item){
            //debugger
            this.$router.push({
                path:"/renew",
                query:{
                    carInfo:item
                }
            })
        },
        pay(item){
            let domT = ''
            //   let ua = navigator.userAgent.toLowerCase()
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                domT = 'weixin'
            }
            if (/AlipayClient/.test(window.navigator.userAgent)) {
                domT = 'alipay'
            }
            let that = this
            let data = {
                channel: domT, 
                recordId: item.id
            }
            let formData = new FormData();
                formData.append('channel','weixin');
                formData.append('recordId',item.id);
            this.$api.owner.getpayadress(formData).then(res => {
                if (res.code === 200) {
                    window.location.href = res.result
                } else {
                    this.$toast(`${res.message}`)
                }
            }).catch(error => {
                this.$toast(`${error}`)
            })
        },
        onChangeSelect(val){
            let array = this.carParkList
            for (let i = 0; i < array.length; i++) {
                const item = array[i];
                if(item.id==val){
                    this.form.depId = item.depId
                }
            }
        },
        handleChange(file, fileList){
            //debugger
            let fileObj = file.raw
            let that = this
            /* return new Promise((resolve, reject) => {
                let _URL = window.URL || window.webkitURL
                let isLt2M = file.size / 1024 / 1024 < 5 // 判定图片大小是否小于4MB
                // 这里需要计算出图片的长宽
                let img = new Image()                                                     
                // 需要把图片赋值
                img.src = URL.createObjectURL(fileObj)
                that.imageUrl = URL.createObjectURL(fileObj)
                img.onload = function () {
                    fileObj.width = img.width // 获取到width放在了file属性上
                    fileObj.height = img.height // 获取到height放在了file属性上
                    let valid = img.width > 2000 // 图片宽度大于2000
                    // console.log(11, file)
                    // 这里我只判断了图片的宽度,compressAccurately有多个参数时传入对象
                    if (isLt2M) {
                        imageConversion.compress(fileObj, {
                            quality: 0.7,
                            width: 500,
                            type: "image/png", 
                        }).then(res => { 
                            console.log("压缩后图片", res)
                            //debugger
                            that.form.file = res;
                            resolve(res)
                        })
                    } else {
                        this.$message.error('上传头像图片大小不能超过 5MB!');
                    }
                }
            }) */
            this.imageUrl = URL.createObjectURL(fileObj);
            this.form.file = fileObj
        },
        beforeUpload(file){
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
            }
            return isJPG && isLt2M;
        },
        onSubmit(){
            let formData = new FormData()
                formData.append('depId',this.form.depId)
                formData.append('parkId',this.form.parkId)
                formData.append('carNum',this.form.carNum)
                formData.append('userId',this.params.userId)
                formData.append('userName',this.form.userName)
                formData.append('userAddress',this.form.userAddress)
                formData.append('phone',this.form.phone)
                formData.append('file',this.form.file)
            this.$api.owner.applyMonthCar(formData).then(res=>{
                if (res.code === 200) {
                    //debugger
                    this.cancleHandle()
                    this.init()
                } else {
                    this.$toast(`${res.message}`)
                }
            }).catch(error => {
                this.$toast(`${error}`)
            })
        },
        cancleHandle(){
            this.dialogShow = false
            this.imageUrl = ""
            this.form = {
                depId:"",
                carNum:"",
                name:"",
                address:"",
                phone:"",
                file:''
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .dialogMain{
        padding: .3rem;
        .uploadWrap{
            width: 100%;
        }
        .carNum{
            width: 100%;
            margin-bottom: 10px;
            /deep/ .wrap{
                padding: 0;
                border-bottom:0;
                .singleBlock{
                    display: inline-block;
                    width: 100%;
                }
                .card-header{
                    float: left;
                    display: inline-block;
                    width: 70px;
                    padding-right:12px;
                    margin:0;
                }
                .num-box{
                    display: inline-flex;
                    width: calc(100% - 70px);
                }
            }
        }
        .avatar-uploader {
            /deep/ .el-upload {
                width: 100%;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .el-upload:hover {
                border-color: #409EFF;
            }            
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 100%;
                height: 3rem;
                line-height: 3rem;
                text-align: center;
            }
            .avatar {
                width: 100%;
                max-height: 3rem;
                display: block;
            }
        }
    }
    .fullWidth{
        width: 100%;
    }
</style>