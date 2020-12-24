<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="月租审核" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list>
                <!-- <van-search
                    v-model="searchVal"
                    placeholder="请输入车牌号"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                </van-search> -->
                <div class="list">
                    <van-card  class="vanCard" v-for="(item,index) in examineList" :key="index">
                        <template #title>
                            <van-row type="flex" >
                                <van-col span="24">
                                    <van-col span="12" class="vanCol"><div class="colInfo">车牌号码:{{item.carNum}}</div></van-col>
                                    <van-col span="12" class="vanCol"><div class="colInfo">手机号:{{item.phone}}</div></van-col>
                                    <van-col span="16" class="vanCol"><div class="colInfo">申请时间:{{item.createTime}}</div></van-col>
                                    <van-col span="8" class="vanCol btnWrap">
                                        <van-button type="info" size="mini" @click="examine(item)">审核</van-button>
                                        <van-button type="info" size="mini" @click="del(item)">删除</van-button>
                                    </van-col>
                                </van-col>
                            </van-row>
                        </template>
                    </van-card>
                    <div class="noSearch" v-if="examineList.length === 0">暂无查询数据</div>
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
            examineList:[],
            params:{
                carNum:"",
                depId:'',
                pageNo:1,
                pageSize:1000 
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
            this.examineList=[]
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.init()
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getExamineList(this.params).then(res=>{
                if(res.code == 200){
                    if(res.result&&res.result.length>0){
                        this.examineList = res.result
                    }
                }else{
                    this.$toast(res.message);
                }
                this.loading = false;
            }).catch((res) => {
                this.loading = false;
            });
        },
        examine(row){
            this.$router.push({
                path:'/detailExamine',
                query:{
                    title:"月租审核",
                    row:row,
                    type:1
                }
            })
        },
        del(item){
            let formData = new FormData()
                formData.append('id',item.id)
            /* this.$dialog.confirm({
                title:"删除",
                message: "",
            }).then(() => { */
                this.$api.home.delApply(formData).then(res=>{
                    this.$toast(res.message)
                    this.init()
                }).catch((res) => {
                    console.log(res)
                })
            /* }).catch(() => {
                // on cancel
                this.$toast("已取消");
            }); */
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