<template>
    <div>
        <van-nav-bar class="navBar" title="库存明细" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
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
                    <van-card  class="vanCard" v-for="(item,index) in cardListData" :key="index">
                        <template #title>
                            <van-row type="flex" justify="center" >
                                <van-col span="12" class="colInfo">时间：{{item.createTime}}</van-col>
                                <van-col span="12" class="colInfo">充值数量：{{item.createTime}}张</van-col>
                                <van-col span="12" class="colInfo">发放记录：{{item.createTime}}张</van-col>
                                <van-col span="12" class="colInfo">操作人：{{item.createTime}}</van-col>
                                <van-col span="24" class="colInfo">返还记录：{{item.createTime}}张</van-col>
                            </van-row>
                        </template>
                    </van-card>
                    <van-card  class="vanCard">
                        <template #title>
                            <van-row type="flex" justify="center" >
                                <van-col span="12" class="colInfo">时间：2020-09-08</van-col>
                                <van-col span="12" class="colInfo">充值数量：50张</van-col>
                                <van-col span="12" class="colInfo">发放记录：200张</van-col>
                                <van-col span="12" class="colInfo">操作人：阿巴阿巴</van-col>
                                <van-col span="24" class="colInfo">返还记录：50张</van-col>
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
                depId:""
            },
            cardListData:[]
        }
    },
    computed: {
        ...mapGetters(["user",'depId'])
    },
    created(){
        this.params.depId = this.depId||sessionStorage.getItem('depId')
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
        init(){
            this.$api.business.listDisQuota(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.cardListData = this.cardListData.concat(rows)
                    //debugger
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.cardListData.length >= this.total) {
                        this.finished = true;
                    }          
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        
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