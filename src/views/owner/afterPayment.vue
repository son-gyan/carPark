<template>
    <div>
        <van-nav-bar class="navBar" title="补缴停车费" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-card
                    v-for="(item,index) in afterPaymentList"  :key="index"
                    :thumb="item.imgUrl"
                    @click-thumb="imgPreview(item.imgUrl)"
                    >
                    <template #title>
                        <p v-if="item.carType==1">月租车</p> 
                        <p v-if="item.carType==2">储值车</p> 
                        <p v-if="item.carType==3">免费车</p> 
                        <p v-if="item.carType==4">临时车</p> 
                        <p v-if="item.carType==5">时段限制月租</p> 
                    </template>
                    <template #desc>
                        <p >车牌：{{item.carNum}}</p>
                        
                        <p >入场：{{item.inTime}}</p>
                    </template>
                </van-card>
                <div class="noSearch" v-if="afterPaymentList.length === 0">暂无查询数据</div>
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
            afterPaymentList:[],
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
            this.$api.owner.getAfterPaymentList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.afterPaymentList = this.afterPaymentList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.afterPaymentList.length >= this.total) {
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
        imgPreview(item){
            let url = []
            url.push(item.imgUrl)
            if(item.outTime){                
                url.push(item.outImgUrl)
            }
            ImagePreview({
                images: url,
                showIndex:true,
                closeable: true,
            });
        }
    }
}
</script>