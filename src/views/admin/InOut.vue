<template>
    <div>
        <van-nav-bar class="navBar" title="进出记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
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
                    placeholder="请输入车牌号"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                </van-search>
                <van-card
                    class="vanCard"
                    v-for="(item,index) in inOutList"  :key="index"
                    :thumb="item.imgUrl?item.imgUrl:'../../assets/images/defaultImg.png'"
                    @click-thumb="imgPreview(item)"
                    >
                    <template #title>
                        <p >车牌号码：{{item.carNum}}</p>
                    </template>
                    <template #desc>
                        <p v-if="item.payType">收款类型: 
                            <span v-if="item.payType==1">现金</span>
                            <span v-if="item.payType==2">移动支付</span>
                            <span v-if="item.payType==3">无感支付</span>
                            <span v-if="item.payType==4">储值扣费</span>
                            <span v-if="item.payType==5">二维码支付</span>
                            <span v-if="item.payType==6">预交费付款</span>
                            <span v-if="item.payType==99">免费</span>
                        </p>
                        <p >入场：{{item.inTime}}</p>
                        <p v-if="item.outTime">出场：{{item.outTime}}</p>
                        <p v-if="item.stayTime">停留时间：{{item.stayTime}}</p>
                        <p v-if="item.orderMoney">总金额：{{item.orderMoney}}元</p>
                        <p v-if="item.payMoney">收费金额：{{item.payMoney}}元</p>
                        <p v-if="item.remarks">备注：{{item.remarks}}</p>
                    </template>
                </van-card>
                <div class="noSearch" v-if="inOutList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component
    },
    data(){
        return {
            searchVal:"",
            finished: false,
            loading: false,
            inOutList:[],
            params:{
                carNum:"",
                depId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
        }
    },
    computed: {
        ...mapGetters(['carParkInfo'])
    },
    created(){
        this.params.depId = this.carParkInfo.depId||sessionStorage.getItem('depId')
        this.init()
    },
    methods:{
        onSearch(){
            this.params.carNum = this.searchVal
            this.inOutList=[]
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.init()
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
            this.init();
        },
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getInOutList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.inOutList = this.inOutList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.inOutList.length >= this.total) {
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
        imgPreview(item){
            let url = []
            url.push(item.imgUrl)
            if(item.outTime){                
                url.push(item.outImgUrl)
            }
            ImagePreview({
                images: url,
                showIndex:true,
                closeable: true,
            });
        }
    }
}
</script>