<template>
    <div>
        <van-nav-bar class="navBar" title="用户管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <!-- <van-search
                    v-model="searchVal"
                    placeholder="搜索用户"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                </van-search> -->
                <van-card
                    class="vanCard"
                    v-for="(item,index) in cardList"  :key="index"
                    ><!-- :thumb="item.imgUrl?item.imgUrl:'../../assets/images/defaultImg.png'"
                    @click-thumb="imgPreview(item.imgUrl)" -->
                    <template #desc>
                        <p >会员名称：{{item.userName}}</p>
                        <p >会员电话：{{item.phone}}</p>
                        <p >会员余额：{{item.money}}</p>
                    </template>
                    <template #footer>
                        <!-- <van-button type="info" size="mini" @click="updatePresentCar(item)">记录</van-button> -->
                        <van-button type="info" size="mini" @click="settlement(item)">结算</van-button>
                    </template>
                </van-card>
                <div class="noSearch" v-if="cardList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
export default {
    data(){
        return {
            finished: false,
            loading: false,
            cardList:[],
            searchVal:'',
            params:{
                //userName:'',
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
        ...mapGetters(['departInfo'])
    },
    created() {
        this.params.depId = this.departInfo.id
        this.init();
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //查询
        onSearch(){
            this.params.userName = this.searchVal
            this.cardList = []
            this.pageNo = 1
            this.loading = true
            this.finished = false;
            this.init();
        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }            
            this.init();
        },
        //数据初始化
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getUserList(this.params).then(res=>{
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
        imgPreview(url){
            ImagePreview({
                images: [url],
                showIndex:false,
                closeable: true,
            });
        },
        settlement(item){
            this.$dialog.confirm({
                title: '结算',
                message: '结算后会员余额将会清零！',
            })
            .then(() => {
                //debugger
                let formData = new FormData();
                formData.append('userId',item.userId)
                this.$api.home.settlementUser(formData).then(res=>{
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
        }
    }
}
</script>
<style lang="less" scoped>
    .vanCard{
        font-size: .3rem;
    }
</style>