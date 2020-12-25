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
                <van-card  class="vanCard"> <!--  v-for="(item,index) in monthlyCarList" :key="index" -->
                    <template #title>
                        <van-row type="flex" justify="space-between"  align="center">
                            <van-col span="14">7元定额券库存剩余：123</van-col>
                            <van-col span="3">
                                <van-button type="info" size="mini" @click="detail">明细</van-button>
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <van-card  class="vanCard"> <!--  v-for="(item,index) in monthlyCarList" :key="index" -->
                    <template #title>
                        <van-row type="flex" justify="space-between"  align="center">
                            <van-col span="14">5元定额券库存剩余：123</van-col>
                            <van-col span="3">
                                <van-button type="info" size="mini" @click="detail">明细</van-button>
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <!-- <div class="noSearch" v-if="monthlyCarList.length === 0">暂无查询数据</div> -->
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
        }
    },
    created(){
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
                this.init();
            },500)
        },
        init(){

        },
        detail(){
            this.$router.push({
                path:'/stockDetail'
            })
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>