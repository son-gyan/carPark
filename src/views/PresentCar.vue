<template>
    <div>
        <van-nav-bar class="navBar" title="在场车辆" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
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
                    <van-col span="12">在场月租车：120</van-col>
                    <van-col span="12">在场临时车：120</van-col>
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
                        
                        <p >入口：{{item.laneName}}</p>
                    </template>
                    <template #footer>
                        <van-button type="info" size="mini" @click="updatePresentCar(item)">修改</van-button>
                    </template>
                </van-card>
                <div class="noSearch" v-if="presentCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main>
                    <van-form @submit="saveData" class="formWrap">
                        <van-field
                            v-model="form.carNum"
                            name="carNum"
                            label="车牌："
                            placeholder="请输入车牌"
                            :rules="[{ required: true, message: '请输入车牌' }]"
                        />
                        <van-field
                            readonly
                            clickable
                            name="inTime"
                            :value="form.inTime"
                            label="入场时间"
                            placeholder="点击选择到期时间"
                            @click="showPickerEndTime = true"
                            />
                        <van-popup v-model="showPickerEndTime" position="bottom">
                            <van-datetime-picker
                                type="datetime"
                                @confirm="onConfirmEndTime"
                                @cancel="showPickerEndTime = false"
                            />
                        </van-popup>
                    </van-form>
                </main>
                <footer>
                    <button @click="saveData">保存</button>
                    <button @click="cancelDialog">取消</button>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import ClickOutside from 'element-ui/src/utils/clickoutside'
import { ImagePreview } from 'vant';
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
    },
    data(){
        return {
            finished: false,
            loading: false,
            isShow:[],
            presentCarList:[],
            searchVal:'',
            params:{
                recordJson:'',
                depId:'',
                pageNo:1,
                pageSize:10 
            },
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
        //查询
        onSearch(){
            if(this.searchVal!=''){
                let json = {
                    carNum:this.searchVal
                }
                this.params.recordJson = JSON.stringify(json)
            }
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
        },
        //数据初始化
        initData(){
            console.log(this.params,'params')
            this.$api.home.getPresentCarList(this.params).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.presentCarList = res.result.records
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
            this.$api.home.addPresentCar(this.form).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.cancelDialog();
                    this.$toast(res.message);
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //弹窗关闭
        cancelDialog(){
            this.dialogShow = false
            this.form={
                depId:this.carParkInfo.depId,
                carNum:'',
                inTime:'',
                serialNum:"",
                parkId:this.carParkInfo.id
            }
        },
        handleDiaClickOutside(){
            if (this.dialogShow) {
                this.dialogShow = false
            }
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
</style>