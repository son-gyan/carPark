<template>
    <div>
        <van-nav-bar class="navBar" title="预约车辆" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-search
                    v-model="searchVal"
                    placeholder="搜索车牌"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="addOrderCar">添加</van-button>
                </van-search>
                <van-row type="flex" justify="center" class="cardHeaderWrap" >
                    <van-col span="24">可添加车位数：{{list.maxNum}}</van-col>
                </van-row>
                <van-card
                    v-for="(item,index) in orderCarList"  :key="index"
                    :thumb="item.imgUrl?item.imgUrl:'../../assets/images/defaultImg.png'"
                    @click-thumb="imgPreview(item.imgUrl)"
                    >
                    <template #title>
                        <p >车牌：{{item.carNum}}</p>
                    </template>
                    <template #desc>
                        <p >车主电话：{{item.ownerPhone}}</p>
                        <p >预约入场时间：{{item.reserveInTime}}</p>
                        <p >预约出场时间：{{item.reserveOutTime}}</p>
                    </template>
                    <template #footer>
                        <van-button type="info" size="mini" @click="exitOrderCar(item.id)" v-if="item.isLeave==0&&item.parkStatus!=0">确认离场</van-button>
                        <span v-if="item.isLeave==1">已确认离场</span>
                        <!-- <van-button type="info" size="mini" @click="delOrderCar(item.id)">删除</van-button> -->
                    </template>
                </van-card>
                <div class="noSearch" v-if="orderCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers presentcarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main>
                    <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                    <van-form @submit="saveData" class="formWrap" ref="form"> <!-- :key="+new Date()" -->
                        <van-field
                            v-model="form.ownerPhone"
                            type="tel"
                            name="ownerPhone"
                            label="车主电话"
                            label-align='right'
                            placeholder="请输入车主电话"
                            :rules="[
                                { required: true, message: '请填写车主电话' },
                                { pattern: /^1[3456789]\d{9}$/, message: '号码格式错误！'}
                            ]"
                        />
                        <van-field
                            readonly
                            clickable
                            name="reserveInTime"
                            :value="form.reserveInTime"
                            label="预约入场时间"
                            placeholder="点击选择入场时间"
                            @click.stop.prevent="showPickerStartTime = true"
                            />
                        <van-field
                            readonly
                            clickable
                            name="reserveOutTime"
                            :value="form.reserveOutTime"
                            label="预约出场时间"
                            placeholder="点击选择入场时间"
                            @click.stop.prevent="showPickerEndTime = true"
                            />
                        <footer>
                            <button native-type="submit">保存</button>
                            <button @click="cancelDialog">取消</button>
                        </footer>
                    </van-form>
                </main>
                
            </div>
        </div>
        <van-popup v-model="showPickerStartTime" position="bottom">
            <van-datetime-picker
                v-model="currentStartDate"
                type="datetime"
                @confirm="onConfirmStartTime"
                @cancel="showPickerStartTime = false"
            />
        </van-popup>
        <van-popup v-model="showPickerEndTime" position="bottom">
            <van-datetime-picker
                v-model="currentEndDate"
                type="datetime"
                @confirm="onConfirmEndTime"
                @cancel="showPickerEndTime = false"
            />
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import ClickOutside from 'element-ui/src/utils/clickoutside'
import { ImagePreview } from 'vant';
import {timeFormate} from '@/utils'
import plateNumber from '@/components/plateNumber'
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
        plateNumber
    },
    data(){
        return {
            finished: false,
            loading: false,
            isShow:[],
            list:{
                curlsNum:0,
                curyzNum:0,
                maxNum:0
            },
            orderCarList:[],
            searchVal:'',
            params:{
                carNum:'',
                merId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增预约车辆",
            form:{
                merId:"",
                carNum:'',
                reserveInTime:'',
                reserveOutTime:"",
                ownerPhone:""
            },
            showPickerStartTime:false,
            showPickerEndTime:false,
            currentStartDate:new Date(),
            currentEndDate: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    directives: { ClickOutside },
    created() {
        this.params.merId = this.user.merId
        this.form.merId = this.user.merId
        this.initData();
    },
    methods: {
        getPlateLicense(data){
            this.form.carNum = data
        },
        //查询
        onSearch(){
            this.params.carNum = this.searchVal
            this.orderCarList = []
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.initData();
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }            
            this.initData();
        },
        //数据初始化
        initData(){
            console.log(this.params,'params')
            /* let formData = new FormData();
            formData.append('id',this.form.depId) */
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.business.getOrderCarList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    this.list.maxNum = res.message
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.orderCarList = this.orderCarList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.orderCarList.length >= this.total) {
                        this.finished = true;
                    }                    
                    this.pageNo++;
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        // 确认离场
        exitOrderCar(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.business.exitOrderCar(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                    this.orderCarList = []
                    this.pageNo = 1
                    this.loading = true
                    this.finished = false;
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        // 删除
        delOrderCar(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.business.delOrderCar(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                    this.orderCarList = []
                    this.pageNo = 1
                    this.loading = true
                    this.finished = false;
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //添加
        addOrderCar(){
            this.dialogShow = true
            this.dialogTit = "新增预约车辆"
            this.currentStartDate = new Date()
            this.currentEndDate = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
            this.form.reserveInTime = this.formatDate(new Date())
            this.form.reserveOutTime = this.formatDate(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
            this.$refs.form.resetValidation();
        },
        onConfirmStartTime(val){
            this.form.reserveInTime = this.formatDate(val)
            this.showPickerStartTime = false
        },
        onConfirmEndTime(val){
            this.form.reserveOutTime = this.formatDate(val)
            this.showPickerEndTime = false
        },
        //弹窗保存
        saveData(){
            console.log(this.form,'this.form');
            if(this.form.carNum == ''){
                this.$toast('请输入车牌号')
                return
            }
            if(!this.form.id||this.form.id==""){
                if(this.form.reserveInTime ==""){
                    this.$toast("请选择预约入场时间");
                    return
                }else if(this.form.reserveOutTime ==""){
                    this.$toast("请选择预约出场时间");
                    return
                }
                this.$api.business.addOrderCar(this.form).then(res=>{
                    if(res.code == 200){
                        debugger
                        this.cancelDialog();
                        this.$toast(res.message);
                        this.orderCarList = []
                        this.pageNo = 1
                        this.loading = true
                        this.finished = false;
                        this.initData();
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }else{
                let param = {
                    id:this.form.id,
                    carNum:this.form.carNum
                }
                let formData = new FormData();
                formData.append('id',this.form.id)
                formData.append('carNum',this.form.carNum)
                this.$api.home.updataCarNum(formData).then(res=>{
                    if(res.code == 200){
                        this.cancelDialog();
                        this.$toast(res.message);
                        this.orderCarList = []
                        this.pageNo = 1
                        this.loading = true
                        this.finished = false;
                        this.initData();
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }
            
        },
        //弹窗关闭
        cancelDialog(){
            this.dialogShow = false
            this.form={
                merId:this.user.merId,
                carNum:'',
                inTime:this.formatDate(new Date()),
                reserveInTime:this.formatDate(new Date()),
                reserveOutTime:this.formatDate(new Date()),
                ownerPhone:""
            }
        },
        handleDiaClickOutside(){
            /* if (this.dialogShow) {
                this.dialogShow = false
            } */
        },
        formatDate(dateTime) {
            let year = dateTime.getFullYear()
            let month = dateTime.getMonth() + 1
            let day = dateTime.getDate()
            let hh = dateTime.getHours();
            let mm = dateTime.getMinutes();
            let ss = dateTime.getSeconds();
            return `${year}-${this.isZero(month)}-${this.isZero(day)}  ${this.isZero(hh)}:${this.isZero(mm)}:${this.isZero(ss)}`;
        },
        isZero(m){
            return m<10?'0'+m:m
        },
        imgPreview(url){
            ImagePreview({
                images: [url],
                showIndex:false,
                closeable: true,
            });
        }
    },
}
</script>
<style lang="less" scoped>
    .searchBtn{
        margin-right:15px
    }
    .mainWrap{
        .title{
            padding: .3rem 0;
            text-align: center;
        }
        .van-row{
            margin: 0 .3rem;
        }
        .cardHeaderWrap 
        {            
            background-color: #eee;
            &.van-row{                
                margin-top:.2rem;
            }
            .van-col {
                padding: .2rem 0;
                text-align: center;
            }
        }
        
        .cardWrap{
            flex-wrap:wrap;
            margin-top:.2rem;
            padding: .1rem 0;
            border: 1px solid #666;
            text-align: center;
            .van-col {
                padding: .1rem 0;
                text-align: center;
            }
            .divider{
                display: inline-block;
                width: 90%;
                margin: 5px auto;
                border-color: #666;
            }
            .van-button{
                height:.6rem;
            }
            .green{
                color:#1fa10e
            }
            .red{
                color:#ff001f
            }
        }
        .van-card{
            p{
                font-size: .3rem;
            }
        }
    }
    .radioItem{
        margin-bottom: 10px;
    }
    .presentcarDialog.covers .dialog{
        width: 7.3rem;
        margin-bottom: 5rem;
    }
</style>