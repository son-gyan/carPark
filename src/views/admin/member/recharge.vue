<template>
    <div>
        <van-nav-bar class="navBar" title="充值记录" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-search
                v-model="searchVal"
                placeholder="搜索会员名称"
                @search="onSearch"
                show-action
                background="#dcdfe6"
                >
                <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
            </van-search>
            <van-card
                class="vanCard"
                v-for="(item,index) in cardList"  :key="index"
                :thumb="item.headUrl?item.headUrl:'../../assets/images/defaultImg.png'"
                @click-thumb="imgPreview(item.headUrl)"
                >
                <template #desc>
                    <p >日期：{{item.createTime}}</p>
                    <p >会员名称：{{item.wxName}}</p>
                    <p >电话号码：{{item.phone}}</p>
                    <p >充值金额：{{item.price}}</p>
                </template>
            </van-card>
            <div class="noSearch" v-if="cardList.length === 0">暂无查询数据</div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
export default {
    data() {
        return {
            finished: false,
            loading: false,
            cardList:[],
            searchVal:'',
            params:{
                wxName:'',
                userId:"",
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
        this.params.userId = this.$route.query.userId
        this.init();
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //查询
        onSearch(){
            this.params.wxName = this.searchVal
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
        init(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.home.getRechargeList(this.params).then(res=>{
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
        }
    }
}
</script>
<style lang="less" scoped>
    .vanCard{
        font-size: .3rem;
    }
</style>