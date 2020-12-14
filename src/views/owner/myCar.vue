<template>
    <div>
        <van-nav-bar class="navBar" title="我的车辆" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-card
                    class="vanCard"
                    v-for="(item,index) in myCarList"  :key="index"
                    :thumb="item.imgUrl?item.imgUrl:'../../assets/images/defaultImg.png'"
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
                <div class="noSearch" v-if="myCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers mycarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main>
                    <van-form @submit="saveData" class="formWrap" :key="+new Date()">
                        <van-field
                            v-if="!form.id||form.id==''"
                            readonly
                            clickable
                            name="inTime"
                            :value="form.inTime"
                            label="车辆颜色"
                            placeholder="点击选择车辆颜色"
                            @click.stop.prevent="showPickerColor = true"
                            />
                    </van-form>
                    <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                    <footer>
                        <button @click="saveData">保存</button>
                        <button @click="cancelDialog">取消</button>
                    </footer>
                </main>
                <van-popup v-model="showPickerColor" position="bottom">
                    <!-- <van-datetime-picker
                        v-model="currentDate"
                        type="datetime"
                        @confirm="onConfirmEndTime"
                        @cancel="showPickerColor = false"
                    /> -->
                    <van-picker
                        show-toolbar
                        :columns="columns"
                        @confirm="onConfirmColor"
                        @cancel="showPickerColor = false"
                    />
                </van-popup>
            </div>
        </div>
    </div>
</template>
<script>
import { ImagePreview } from 'vant';
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
            myCarList:[],
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
            dialogTit:"新增我的车辆",
            showPickerColor:false,
            form:{
                depId:'',
                carNum:'',
                inTime:'',
                serialNum:"",
                parkId:""
            },
            columns:['红色','绿色','白色','橙色']
        }
    },
    created() {
        this.initData();
    },
    methods: {
        getPlateLicense(data){
            this.form.carNum = data
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
        //初始化
        initData(){

        },
        onConfirmColor(){

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
    .mycarDialog.covers .dialog{
        width: 7.3rem;
        margin-bottom: 5rem;
    }
</style>