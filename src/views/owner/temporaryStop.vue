<template>
    <div>
        <van-nav-bar class="navBar" title="临停缴费" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-card class="vanCard"
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
                        <van-button type="info" size="mini" @click="payBack(item)">{{item.outTime?'支付':'预付'}}</van-button>
                    </p>
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
<style lang="less" scoped>
.van-card{
    .pFooter{
        text-align: right;
    }
}
</style>