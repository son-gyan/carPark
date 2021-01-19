<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="商家库存" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list 
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text=""
                @load="onLoad"
                :offset="10"
                >
                <van-card  class="vanCard" v-for="(item,index) in stockList" :key="index"> <!--   -->
                    <template #title>
                        <van-row type="flex" justify="space-between"  align="center">
                            <van-col span="14" v-if="item.quotaType==1">{{item.quotaName}}券库存剩余：{{item.stockNum}}张</van-col>
                            <van-col span="14" v-if="item.quotaType==2">时长券库存剩余：{{item.quotaData}}时</van-col>
                            <van-col span="14" v-if="item.quotaType==3">金额券库存剩余：{{item.quotaData}}元</van-col>
                            <van-col span="14" v-if="item.quotaType==4">次券库存剩余：{{item.stockNum}}张</van-col>
                            <van-col span="14" v-if="item.quotaType==5">住店车券库存剩余：{{item.stockNum}}张</van-col>
                            <van-col span="3">
                                <!-- <van-button type="info" size="mini" @click="detail(item.quotaType)">明细</van-button> -->
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            finished: false,
            loading: false,
            stockList:[],
            params:{
                merId:'',
                pageNo:1,
                pageSize:1000 
            },
            pageNo: 1,//请求第几页
            pageSize: 1000,//每页请求的数量
            total: 0,//总共的数据条数
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        this.params.merId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.initData();
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }
            // 异步更新数据
            setTimeout(() => {            
                this.initData();
            },500)
        },
        initData(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.business.listMerDiscountStock(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.stockList = this.stockList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.stockList.length >= this.total) {
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
        detail(quotaType){
            this.$router.push({
                path:'/stockDetail'
            })
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>