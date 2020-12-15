<template>
    <div>
        <van-nav-bar class="navBar" title="我的月租车" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-card>
                    <template #title>
                        <van-row type="flex" justify="center">
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                        </van-row>
                    </template>
                </van-card>
                <van-card>
                    <template #title>
                        <van-row type="flex" justify="center">
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                        </van-row>
                    </template>
                </van-card>
                <van-card>
                    <template #title>
                        <van-row type="flex" justify="center">
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                        </van-row>
                    </template>
                </van-card>
                <van-card>
                    <template #title>
                        <van-row type="flex" justify="center">
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                            <van-col span="6">span: 6</van-col>
                        </van-row>
                    </template>
                </van-card>
                <div class="noSearch" v-if="monthlyCarList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"

export default {
    data(){
        return {
            searchVal:"",
            finished: false,
            loading: false,
            monthlyCarList:[],
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
            this.init();
        },
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.owner.getMonthlyCarList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.monthlyCarList = this.monthlyCarList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.monthlyCarList.length >= this.total) {
                        this.finished = true;
                    }                    
                    this.pageNo++;
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        }
    }
}
</script>