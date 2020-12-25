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
                    <van-card  class="vanCard"> <!--  v-for="(item,index) in tableData" :key="index" -->
                        <template #title>
                            <van-row type="flex" justify="center" >
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
export default {
    data(){
        return {
            finished: false,
            loading: false,
            searchVal:""
        }
    },
    created(){
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSearch(){

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