<template>
    <div>
        <van-nav-bar class="navBar" title="支付记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="0"
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
                <div class="list">
                    <el-table
                        size="mini"
                        :data="inOutList"
                        @row-click="viewDetail"
                        style="width: 100%">
                        <el-table-column
                            prop="carNum"
                            label="车牌"
                            width="95"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="inTime"
                            label="进场时间"
                            width="135"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="outTime"
                            label="出场时间"
                            width="135"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="stayTime"
                            label="停留时间"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="needPay"
                            label="收费金额"
                            align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.needPay?scope.row.needPay:0}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
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
            payList:[],
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
            this.payList=[]
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
            this.$api.home.getPayList(this.params).then(res=>{
                if(res.code == 200){
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.payList = this.payList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.payList.length >= this.total) {
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
        viewDetail(row){
            this.$router.push({
                path:'/detail',
                query:{
                    title:"支付记录",
                    row:row,
                    type:1
                }
            })
        }
    }
}
</script>