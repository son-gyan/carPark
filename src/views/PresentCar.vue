<template>
    <div>
        <van-nav-bar class="navBar" title="在场车辆" left-text="返回" left-arrow @click-left="onClickLeft" />
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
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="addPresentCar">添加</van-button>
                </van-search>
                <van-row type="flex" justify="center" class="cardHeaderWrap" >
                    <van-col span="12">在场月租车：{{list.curyzNum}}</van-col>
                    <van-col span="12">在场临时车：{{list.curlsNum}}</van-col>
                </van-row>
                <van-card
                    v-for="(item,index) in presentCarList"  :key="index"
                    :thumb="item.imgUrl"
                    @click-thumb="imgPreview(item.imgUrl)"
                    >
                    <template #title>
                        <p v-if="item.carType==1">月租车</p> 
                        <p v-if="item.carType==2">储值车</p> 
                        <p v-if="item.carType==3">免费车</p> 
                        <p v-if="item.carType==4">临时车</p> 
                        <p v-if="item.carType==5">时段限制月租</p> 
                    </template>
                    <template #desc>
                        <p >车牌：{{item.carNum}}</p>
                        
                        <p >入场：{{item.inTime}}</p>
                    </template>
                    <template #footer>
                        <van-button type="info" size="mini" @click="updatePresentCar(item)">修改</van-button>
                    </template>
                </van-card>
                <div class="noSearch" v-if="presentCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers presentcarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main>
                    <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                    <van-form @submit="saveData" class="formWrap" :key="+new Date()">
                        <!-- <van-field
                            v-model="form.carNum"
                            name="carNum"
                            label="车牌："
                            placeholder="请输入车牌"
                            :rules="[{ required: true, message: '请输入车牌' }]"
                        /> -->
                        <van-field
                            v-if="!form.id||form.id==''"
                            readonly
                            clickable
                            name="inTime"
                            :value="form.inTime"
                            label="入场时间"
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
        <van-popup v-model="showPickerEndTime" position="bottom">
            <van-datetime-picker
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
                curyzNum:0
            },
            presentCarList:[],
            searchVal:'',
            params:{
                carNum:'',
                depId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增在场车辆",
            form:{
                depId:'',
                carNum:'',
                inTime:'',
                serialNum:"",
                parkId:""
            },
            showPickerEndTime:false
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    directives: { ClickOutside },
    created() {
        this.params.depId = this.carParkInfo.depId
        this.form.depId = this.carParkInfo.depId
        this.form.parkId = this.carParkInfo.id
        this.initData();
    },
    methods: {
        getPlateLicense(data){
            this.form.carNum = data
        },
        //查询
        onSearch(){
            /* if(this.searchVal!=''){
                let json = {
                    carNum:this.searchVal
                }
                this.params.recordJson = JSON.stringify(json)
            } */
            this.params.carNum = this.searchVal
            this.presentCarList = []
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
            let para = {
                depId:this.form.depId
            }
            this.$api.home.onParkTypeNum(para).then(res=>{
                if(res.code == 200){
                    //debugger
                    this.list.curlsNum = res.result.temporary
                    this.list.curyzNum = res.result.month
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getPresentCarList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.presentCarList = this.presentCarList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.presentCarList.length >= this.total) {
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
        //添加
        addPresentCar(){
            this.dialogShow = true
            this.dialogTit = "新增在场车辆"
            this.form.inTime = this.formatDate(new Date())
        },
        //修改
        updatePresentCar(item){
            this.dialogShow = true
            this.dialogTit = "修改在场车辆"
            this.form.id = item.id
            this.form.carNum = item.carNum
            this.form.inTime = item.inTime
        },
        onConfirmEndTime(val){
            this.form.inTime = this.formatDate(val)
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
                if(this.form.inTime ==""){
                    this.$toast("请选择入场时间");
                    return
                }
                this.$api.home.addPresentCar(this.form).then(res=>{
                    if(res.code == 200){
                        this.cancelDialog();
                        this.$toast(res.message);
                        this.presentCarList = []
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
                        this.presentCarList = []
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
                depId:this.carParkInfo.depId,
                carNum:'',
                inTime:this.formatDate(new Date()),
                serialNum:"",
                parkId:this.carParkInfo.id
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