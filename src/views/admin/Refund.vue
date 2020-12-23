<template>
    <div class="refund">
        <van-nav-bar class="navBar" title="预付退款" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list 
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                @load="onLoad"
                :offset="0"
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
                <div class="list cardList">
                    <van-card  class="vanCard" v-for="(item,index) in tableData" :key="index">
                        <template #title>
                            <van-row type="flex" >
                                <van-col span="24">
                                    <van-col span="12" class="vanCol">车牌号码:{{item.carNum}}</van-col>
                                    <van-col span="12" class="vanCol">
                                        <div>
                                            收款类型: 
                                            <span v-if="item.payType==1">现金</span> 
                                            <span v-else-if="item.payType==2">移动支付</span> 
                                            <span v-else-if="item.payType==3">无感支付</span> 
                                            <span v-else-if="item.payType==4">储值扣费</span> 
                                            <span v-else-if="item.payType==5">二维码支付</span> 
                                            <span v-else-if="item.payType==6">预交费付款</span> 
                                            <span v-else-if="item.payType==99">免费</span>
                                            <span v-else>无</span>
                                        </div>  
                                    </van-col>
                                </van-col>
                                <van-col span="24">
                                    <van-col span="12" class="vanCol">入场:{{item.inTime}}</van-col>
                                    <van-col span="12" class="vanCol"><div>出场:{{item.outTime?item.outTime:"无"}}</div></van-col>
                                </van-col>
                                <van-col span="24">
                                    <van-col span="12" class="vanCol"><div>收费金额:{{item.orderMoney?item.orderMoney:0}}元</div></van-col>
                                    <van-col span="12" class="vanCol">车辆类型:
                                        <span v-if="item.carType==1">月租车</span>
                                        <span v-else-if="item.carType==2">储值车</span>
                                        <span v-else-if="item.carType==3">免费车</span>
                                        <span v-else-if="item.carType==4">临时车</span>
                                        <span v-else-if="item.carType==5">时段限制月租</span>
                                        <span v-else>无</span>
                                    </van-col>
                                    <van-col span="12" class="vanCol">
                                        <div>退款金额:{{info.walletMoney-info.orderMoney}}元</div></van-col>
                                    <van-col span="12" class="vanCol">
                                        <van-button type="info" size="mini" @click="refund(item)">退款</van-button>
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
                    <div class="noSearch" v-if="tableData.length === 0">暂无查询数据</div>
                </div>
            </van-list>
        </div>
        <van-dialog v-model="show" title="退款原因" show-cancel-button @confirm="onConfirm" @cancel="onCancel">
            <van-field
                v-model="message"
                rows="1"
                autosize
                label="留言"
                type="textarea"
                placeholder="请输入退款原因"
                />
        </van-dialog>
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
            finished: false,
            loading: false,
            searchVal:"",
            tableData:[],
            params:{
                depId:"",
                carNum:"",
                pageNo:1,
                pageSize:10
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            show:false,
            message:"",
            recordId:"",
            refundMoney:""
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
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSearch(){
            this.params.carNum = this.searchVal
            this.tableData=[]
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.init()
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
            this.$api.home.getRefundList(this.params).then(res=>{
                if(res.code == 200){
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.tableData = this.tableData.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.tableData.length >= this.total) {
                        this.finished = true;
                    }                    
                    this.pageNo++;
                }else{
                    this.$toast(res.message);
                }
                this.loading = false;
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
        },
        refund(info){
            this.recordId = info.id
            this.refundMoney = info.walletMoney-info.orderMoney
            this.show = true
        },
        onConfirm(){
            /* let params = {
                recordId:this.recordId,
                refundMoney:this.refundMoney,
                reason:this.message
            } */
            let formData = new FormData()
            formData.append("recordId",this.recordId)
            formData.append("refundMoney",this.refundMoney)
            formData.append("reason",this.message)
            this.$api.home.refund(formData).then(res=>{
                if(res.code == 200){
                    //debugger
                    this.$toast(res.message);
                }else{
                    this.$toast(res.message);
                }
                this.loading = false;
            }).catch((res) => {
                this.loading = false;
            });
        },
        onCancel(){
            this.show = false
            this.message = ""
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
    .list{
        /deep/ .el-table th{
            background: #1989fa;
            color:#fff;
        }
    }
</style>