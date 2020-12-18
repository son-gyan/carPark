<template>
    <div>
        <van-nav-bar class="navBar" title="我的月租车" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <div class="searchWrap">
                    <van-button type="info" size="mini" @click="apply">月租申请</van-button>
                </div>
                <van-card  class="vanCard" v-for="(item,index) in monthlyCarList" :key="index">
                    <template #title>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">皇家后宫车场</van-col>
                            <van-col span="7">{{item.licensePlate}}</van-col>
                            <van-col span="3">
                                <van-button type="info" size="mini" @click="pay">续费</van-button>
                            </van-col>
                        </van-row>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">到期时间：{{item.expireTime}}</van-col>
                            <van-col span="7">剩余28天</van-col>
                            <van-col span="3">
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <van-card  class="vanCard">
                    <template #title>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">皇家后宫车场</van-col>
                            <van-col span="7">鄂e88888</van-col>
                            <van-col span="3">
                                <van-button type="info" size="mini" @click="pay">续费</van-button>
                            </van-col>
                        </van-row>
                        <van-row type="flex" justify="center" >
                            <van-col span="14">到期时间：2020-11-11</van-col>
                            <van-col span="7">剩余28天</van-col>
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
                            <el-select v-model="form.park" placeholder="请选择活动区域">
                                <el-option label="皇家卫浴停车场" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="carNum">
                            <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                        </div>
                        <el-form-item label="姓名：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="住址：">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="电话：">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <div class="uploadWrap">
                            <el-upload
                                class="avatar-uploader"
                                action="string"
                                http-request="uploadfile"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar" @click="handlePictureCardPreview">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="imageUrl" alt="">
                            </el-dialog>
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
                park:"",
                carNum:"",
                name:"",
                address:"",
                phone:""
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
        this.params.userId = this.user.id
        this.init()
    },
    methods:{
        getPlateLicense(data){
            this.form.carNum = data
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.$api.owner.getMonthlyCarList(this.params).then(res=>{
                if(res.code == 200){
                    let rows = res.result; //请求返回当页的列表
                    this.monthlyCarList = rows
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
            this.$api.owner.getpayadress(data).then(res => {
                if (+res.code === 200) {
                    window.location.href = res.result
                } else {
                    this.$toast('提示', `${res.message}`)
                }
            }).catch(error => {
                this.$toast('提示', `${error}`)
            })
        },
        handleSuccess(res, file){
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            /* if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            } */
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handlePictureCardPreview(){
            this.dialogVisible = true
        },
        uploadfile(){

        },
        onSubmit(){

        },
        cancleHandle(){
            this.dialogShow = false
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
</style>