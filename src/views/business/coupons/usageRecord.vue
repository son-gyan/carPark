<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="券使用记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text=""
                @load="onLoad"
                :offset="10"
                >
                <van-search class="vanSearch"
                    v-model="searchVal"
                    placeholder="请输入"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                </van-search>
                <div class="list cardList">
                    <van-card  class="vanCard"  v-for="(item,index) in tableData" :key="index"> <!--  -->
                        <template #title>
                            <van-row type="flex" justify="center" >
                                <van-col span="24" class="colInfo">
                                    <h2>车牌:{{item.bindCar}}</h2>
                                </van-col>
                                <van-col span="12" class="colInfo">领取时间：2020-09-08</van-col>
                                <van-col span="12" class="colInfo">使用券类型：7元定额券</van-col>
                                <van-col span="12" class="colInfo">入场时间：09-08 12:30:26</van-col>
                                <van-col span="12" class="colInfo">出场时间：09-08 12:30:26</van-col>
                                <van-col span="24" class="colInfo">使用时间：09-08 12:30:26</van-col>
                            </van-row>
                        </template>
                    </van-card>
                </div>
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
            searchVal:"",
            params:{
                carNum:"",
                merId:'',
                pageNo:1,
                pageSize:10
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            tableData:[],
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created(){
        this.params.merId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
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
            // 异步更新数据
            setTimeout(() => {            
                this.init();
            },500)
        },
        init(){  //quotaUseList
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            if(this.pageNo==1){
                this.tableData = []
            }
            this.$api.business.quotaUseList(this.params).then(res=>{
                if(res.code == 200){
                    //debugger
                    this.loading = false;
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
            }).catch((res) => {
                this.loading = false;
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
    .list{
        .vanCard{
            .colInfo{
                line-height: .5rem;
            }
        }
    }
</style>