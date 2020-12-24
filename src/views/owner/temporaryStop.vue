<template>
    <div>
        <van-nav-bar class="navBar" title="临停缴费" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <!-- <van-card class="vanCard"
                v-for="(item,index) in temporaryStopList"  :key="index"
                :thumb="item.imgUrl"
                @click-thumb="imgPreview(item)"
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
                    <p v-if="item.outTime">出场：{{item.outTime}}</p>
                    <p v-if="item.remarks">优惠信息：{{item.remarks}}</p>
                    <p v-if="item.payMoney">收费金额：{{item.payMoney}}</p>
                    <p class="pFooter"  >
                        <van-button type="info" size="mini" @click="payBack(item)" v-if="item.outTime">支付</van-button>
                        <van-button type="info" size="mini" @click="advancePay(item)" v-else>预付</van-button>
                    </p>
                </template>
            </van-card> -->
            <van-card  class="vanCard" v-for="(item,index) in temporaryStopList" :key="index">
                <template #title>
                    <van-row type="flex" >
                        <van-col span="24">
                            <van-col span="12" class="vanCol">
                                <span v-if="item.carType==1">月租车</span>
                                <span v-else-if="item.carType==2">储值车</span>
                                <span v-else-if="item.carType==3">免费车</span>
                                <span v-else-if="item.carType==4">临时车</span>
                                <span v-else-if="item.carType==5">时段限制月租</span>
                                <span v-else>无</span>
                            </van-col>
                            <van-col span="12" class="vanCol">车牌:{{item.carNum}}</van-col>
                        </van-col>
                        <van-col span="24">
                            <van-col span="12" class="vanCol">入场:{{item.inTime}}</van-col>
                            <van-col span="12" class="vanCol" v-if="item.outTime"><div>出场:{{item.outTime?item.outTime:"无"}}</div></van-col>
                            <van-col span="24" class="vanCol"><div>优惠信息:{{item.stayTime?item.stayTime:0}}</div></van-col>
                        </van-col>
                        <van-col span="24">
                            <van-col span="12" class="vanCol"><div>总金额:{{item.orderMoney?item.orderMoney:0}}元</div></van-col>
                            <van-col span="12" class="vanCol"><div>收费金额:{{item.payMoney?item.payMoney:0}}元</div></van-col>
                            <van-col span="12" class="vanCol btnWrap">
                                <van-button type="info" size="mini" @click="payBack(item)" v-if="item.outTime">支付</van-button>
                        <van-button type="info" size="mini" @click="advancePay(item)" v-else>预付</van-button>
                            </van-col>
                        </van-col>
                    </van-row>
                    <van-row type="flex" >
                        <van-col span="12" class="vanCol">
                            <span class="photoLabel">进场照片：</span>
                            <img :src="item.imgUrl" alt="" srcset="" @click="imgPreview(item.imgUrl)">
                        </van-col>
                        <van-col span="12" class="vanCol" v-if="item.outTime">
                            <span class="photoLabel">出场照片：</span>
                            <img :src="item.outImgUrl" alt="" srcset="" @click="imgPreview(item.outImgUrl)">
                        </van-col>
                    </van-row>
                </template>
            </van-card>
            <div class="noSearch" v-if="temporaryStopList.length === 0">暂无查询数据</div>
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
            temporaryStopList:[],
            params:{
                userId:""
            }
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created(){
        this.params.userId = this.user.id
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.$api.owner.getTemporaryStopList(this.params).then(res=>{
                if(res.code == 200){
                    if(res.result&&res.result.length>0){
                        let rows = res.result; //请求返回当页的列表
                        this.temporaryStopList = rows
                    }
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
        //支付
        payBack(item){
            let domT = ''
            //   let ua = navigator.userAgent.toLowerCase()
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                domT = 'weixin'
            }
            if (/AlipayClient/.test(window.navigator.userAgent)) {
                domT = 'alipay'
            }
            let that = this
            let data = {
                channel: domT, 
                recordId: item.id
            }
            this.$api.owner.getpayadress(data).then(res => {
                if (+res.code === 200) {
                    window.location.href = res.result
                } else {
                    this.$toast('提示', `${res.message}`)
                }
            }).catch(error => {
                this.$toast('提示', `${error}`)
            })
        },
        //预付
        advancePay(item){
            let domT = ''
            //   let ua = navigator.userAgent.toLowerCase()
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                domT = 'weixin'
            }
            if (/AlipayClient/.test(window.navigator.userAgent)) {
                domT = 'alipay'
            }
            let that = this
            let data = {
                channel: domT, 
                recordId: item.id
            }
            this.$api.owner.getAdvancePay(data).then(res => {
                if (+res.code === 200) {
                    window.location.href = res.result
                } else {
                    this.$toast('提示', `${res.message}`)
                }
            }).catch(error => {
                this.$toast('提示', `${error}`)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.van-card{
    .pFooter{
        text-align: right;
    }
}
</style>