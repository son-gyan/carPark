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
                <van-card  class="vanCard" v-for="(item,index) in cardList" :key="index"> <!--   -->
                    <template #title>
                        <van-row type="flex" >
                            <van-col span="24">
                                <van-col span="12" class="vanCol"><div class="colInfo">套餐名称:{{item.name}}</div></van-col>
                                <van-col span="12" class="vanCol"><div class="colInfo">套餐金额:{{item.price}}</div></van-col>
                                <van-col span="16" class="vanCol"><div class="colInfo">赠送金额:{{item.givePrice}}</div></van-col>
                                <van-col span="8" class="vanCol btnWrap">
                                    <van-button type="info" size="mini" @click="edit(item)">修改</van-button>
                                    <van-button type="info" size="mini" @click="del(item)">删除</van-button>
                                </van-col>
                            </van-col>
                        </van-row>
                    </template>
                </van-card>
                <div class="noSearch" v-if="cardList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers mycarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main class="dialogMain">
                    <el-form ref="form" :model="form" label-width="90px" size="mini" class="elForm">
                        <el-form-item label="套餐名称：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="套餐金额：">
                            <el-input-number class="fullWidth" v-model="form.price" :min="0" :controls="false" :precision="1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="赠送金额：">
                            <el-input-number class="fullWidth" v-model="form.givePrice" :min="0" :controls="false" :precision="1"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button @click="cancelDialog">取消</el-button>
                        </el-form-item>
                    </el-form>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import ClickOutside from 'element-ui/src/utils/clickoutside'
export default {
    directives: { ClickOutside },
    data () {
        return {
            finished: false,
            loading: false,
            cardList:[],
            params:{
                depId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增套餐",
            form:{
                depId:"",
                name:"",
                price:"",
                givePrice:""
            }
        }
    },
    computed: {
        ...mapGetters(['departInfo'])
    },
    created() {
        this.params.depId = this.departInfo.id
        this.form.depId = this.departInfo.id
        this.init();
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
            this.$api.home.getSetMealList(this.params).then(res=>{
                if(res.code == 200){
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
        add(){
            this.dialogShow = true
        },
        edit(item){
            this.dialogShow = true
            this.dialogTit = "编辑套餐"
            this.form.id = item.id
            this.form.name = item.name
            this.form.price = item.price
            this.form.givePrice = item.givePrice
        },
        del(item){
            this.$dialog.confirm({
                title: '删除',
                message: '确认删除该套餐？',
            })
            .then(() => {
                let formData = new FormData();
                formData.append('id',item.id)
                this.$api.home.delSetMeal(formData).then(res=>{
                    if(res.code == 200){
                        this.$toast(res.message);
                        this.cardList = []
                        this.pageNo = 1
                        this.loading = true
                        this.finished = false;
                        this.init();
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }).catch(() => {
                // on cancel
            });
        },
        onSubmit(){
            if(!this.form.id||this.form.id==""){
                this.$api.home.addSetMeal(this.form).then(res=>{
                    if(res.code == 200){
                        this.cancelDialog();
                        this.$toast(res.message);
                        this.cardList = []
                        this.pageNo = 1
                        this.loading = true
                        this.finished = false;
                        this.init();
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }else{
                this.$api.home.editSetMeal(this.form).then(res=>{
                    if(res.code == 200){
                        this.cancelDialog();
                        this.$toast(res.message);
                        this.cardList = []
                        this.pageNo = 1
                        this.loading = true
                        this.finished = false;
                        this.init();
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    this.loading = false;
                });
            }
        },
        //弹窗关闭
        cancelDialog(){
            this.dialogShow = false
            this.form={
                depId:this.departInfo.id,
                name:"",
                price:"",
                givePrice:""
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .vanCard{
        .colInfo{
            line-height: .5rem;
        }
    }
    .elForm{
        margin: .3rem;
    }
</style>