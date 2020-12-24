<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="套餐管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-row type="flex" class="topBtnGroup">
                    <van-col span="24">
                        <van-button type="info" size="mini" @click="add()">新增套餐</van-button>
                    </van-col>
                </van-row>
                <van-card  class="vanCard"> <!--  v-for="(item,index) in examineList" :key="index" -->
                    <template #title>
                        <van-row type="flex" >
                            <van-col span="24">
                                <van-col span="12" class="vanCol"><div class="colInfo">套餐名称:{{'item.carNum'}}</div></van-col>
                                <van-col span="12" class="vanCol"><div class="colInfo">套餐金额:{{'item.phone'}}</div></van-col>
                                <van-col span="16" class="vanCol"><div class="colInfo">赠送金额:{{'item.createTime'}}</div></van-col>
                                <van-col span="8" class="vanCol btnWrap">
                                    <van-button type="info" size="mini" @click="edit(item)">修改</van-button>
                                    <van-button type="info" size="mini" @click="del(item)">删除</van-button>
                                </van-col>
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <div class="noSearch" v-if="setMealList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers mycarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main class="dialogMain">
                    <el-form ref="form" :model="form" label-width="70px" size="mini">
                        <el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button @click="cancleHandle">取消</el-button>
                        </el-form-item>
                    </el-form>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import ClickOutside from 'element-ui/src/utils/clickoutside'
export default {
    directives: { ClickOutside },
    data () {
        return {
            finished: false,
            loading: false,
            setMealList:[],
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增套餐"
        }
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

        },
        add(){
            this.dialogShow = true
        },
        edit(item){

        },
        del(item){

        },
        onSubmit(){

        },
        cancleHandle(){
            
        }
    }
}
</script>
<style lang="less" scoped>
    .vanCard{
        .colInfo{
            line-height: .5rem;
        }
    }
    
</style>