<template>
    <div>
        <van-nav-bar class="navBar" title="消费记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list 
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-search class="vanSearch"
                    v-model="searchVal"
                    placeholder="请输入车牌号"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                </van-search>
                <div class="list cardList van-clearfix">
                    <van-card  class="vanCard" v-for="(item,index) in cardList" :key="index">
                        <template #title>
                            <van-row type="flex" >
                                <van-col span="24">
                                    <van-col span="12" class="vanCol">车牌号码:{{item.carNum}}</van-col>
                                    <van-col span="12" class="vanCol">
                                        <div>
                                            收款类型: 
                                            <span v-if="item.payType==7">VIP消费</span>
                                        </div>  
                                    </van-col>
                                </van-col>
                                <van-col span="24">
                                    <van-col span="12" class="vanCol">入场:{{item.inTime}}</van-col>
                                    <van-col span="12" class="vanCol"><div>出场:{{item.outTime?item.outTime:"无"}}</div></van-col>
                                </van-col>
                                <van-col span="24">
                                    <van-col span="12" class="vanCol"><div>总金额:{{item.orderMoney?item.orderMoney:0}}元</div></van-col>
                                    <van-col span="12" class="vanCol"><div>收费金额:{{item.payMoney?item.payMoney:0}}元</div></van-col>
                                    <van-col span="12" class="vanCol"><div>优惠信息:{{item.remarks?item.remarks:"无"}}</div></van-col>
                                    <van-col span="12" class="vanCol">车辆类型:
                                        <span v-if="item.carType==1">月租车</span>
                                        <span v-else-if="item.carType==2">储值车</span>
                                        <span v-else-if="item.carType==3">免费车</span>
                                        <span v-else-if="item.carType==4">临时车</span>
                                        <span v-else-if="item.carType==5">时段限制月租</span>
                                        <span v-else>无</span>
                                    </van-col>
                                </van-col>
                            </van-row>
                            <van-row type="flex" >
                                <van-col span="12" class="vanCol">
                                    <span class="photoLabel">进场照片：</span>
                                    <img :src="item.imgUrl" alt="" srcset="" @click="imgPreview(item.imgUrl)">
                                </van-col>
                                <van-col span="12" class="vanCol" v-if="item.outTime">
                                    <span class="photoLabel">出场照片：</span>
                                    <img :src="item.outImgUrl" alt="" srcset="" @click="imgPreview(item.outImgUrl)">
                                </van-col>
                            </van-row>
                        </template>
                    </van-card>
                    <div class="noSearch" v-if="cardList.length === 0">暂无查询数据</div>
                </div>
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
            type:2,
            cardList:[],
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
        ...mapGetters(['departInfo'])
    },
    created(){
        this.params.depId = this.departInfo.id
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSearch(){
            this.params.carNum = this.searchVal
            this.cardList=[]
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.init()
        },
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getConsumeList(this.params).then(res=>{
                if(res.code == 200){
                    debugger
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.cardList = this.cardList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.cardList.length >= this.total) {
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
        imgPreview(url){
            ImagePreview({
                images: [url],
                showIndex:false,
                closeable: true,
            });
        }
    }
}
</script>

<style lang="less" scoped>
    .mainWrap{
        /deep/ .vanCard{
            padding: 5px;
                .vanCol{
                padding-bottom:.1rem ;
                img{
                    max-width: 95%;
                    max-height: 2rem;
                }
                .photoLabel{
                    display: inline-block;
                    margin-bottom: .1rem;
                }
            }
        }
    }
</style>