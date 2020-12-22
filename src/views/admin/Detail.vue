<template>
    <div class="detail">
        <van-nav-bar class="navBar" :title="title" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-card  class="vanCard">
                <template #title>
                    <van-row type="flex" >
                        <van-col span="24">
                            <van-col span="12" class="vanCol">车牌号码:{{info.carNum}}</van-col>
                            <van-col span="12" class="vanCol" v-if="info.payType">
                                <div>
                                    收款类型: 
                                    <span v-if="info.payType==1">现金</span> 
                                    <span v-if="info.payType==2">移动支付</span> 
                                    <span v-if="info.payType==3">无感支付</span> 
                                    <span v-if="info.payType==4">储值扣费</span> 
                                    <span v-if="info.payType==5">二维码支付</span> 
                                    <span v-if="info.payType==6">预交费付款</span> 
                                    <span v-if="info.payType==99">免费</span>
                                </div>  
                            </van-col>
                        </van-col>
                        <van-col span="24">
                            <van-col span="12" class="vanCol">入场:{{info.inTime}}</van-col>
                            <van-col span="12" class="vanCol" v-if="info.outTime"><div>出场:{{info.outTime}}</div></van-col>
                        </van-col>
                        <van-col span="24">
                            <van-col span="12" class="vanCol" v-if="type!=3"><div>总金额:{{info.orderMoney}}元</div></van-col>
                            <van-col span="12" class="vanCol" v-if="type==3"><div>收费金额:{{info.orderMoney}}元</div></van-col>
                            <van-col span="12" class="vanCol" v-else><div>收费金额:{{info.payMoney?info.payMoney:0}}元</div></van-col>
                            <van-col span="12" class="vanCol">车辆类型:
                                <span v-if="info.carType==1">月租车</span>
                                <span v-if="info.carType==2">储值车</span>
                                <span v-if="info.carType==3">免费车</span>
                                <span v-if="info.carType==4">临时车</span>
                                <span v-if="info.carType==5">时段限制月租</span>
                            </van-col>
                            <van-col span="12" class="vanCol" v-if="type==3">
                                <div>退款金额:{{info.walletMoney-info.orderMoney}}元</div></van-col>
                            <van-col span="12" class="vanCol" v-if="type==3">
                                <van-button type="info" size="mini" @click="refund(info)">退款</van-button>
                            </van-col>
                        </van-col>
                    </van-row>
                    <van-row type="flex" >
                        <van-col span="12" class="vanCol">
                            <span class="photoLabel">进场照片：</span>
                            <img :src="info.imgUrl" alt="" srcset="" @click="imgPreview(info.imgUrl)">
                        </van-col>
                        <van-col span="12" class="vanCol" v-if="info.outTime">
                            <span class="photoLabel">出场照片：</span>
                            <img :src="info.outImgUrl" alt="" srcset="" @click="imgPreview(info.outImgUrl)">
                        </van-col>
                    </van-row>
                </template>
            </van-card>
        </div>
        <van-dialog v-model="show" title="退款原因" show-cancel-button @confirm="onConfirm" @cancel="onCancel">
            <van-field
                v-model="message"
                rows="1"
                autosize
                label="留言"
                type="textarea"
                placeholder="请输入退款原因"
                />
        </van-dialog>
    </div>
</template>
<script>
import { ImagePreview } from 'vant';
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component
    },
    data(){
        return {
            title:"",
            info:{},
            type:-1,
            show:false,
            message:"",
            recordId:"",
            refundMoney:""
        }
    },
    created(){
        this.title = this.$route.query.title
        this.info = this.$route.query.row
        this.type = this.$route.query.type
        //console.log(JSON.stringify(this.info),'info')
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1)
        },
        imgPreview(url){
            ImagePreview({
                images: [url],
                showIndex:false,
                closeable: true,
            });
        },
        refund(info){
            this.recordId = info.id
            this.refundMoney = info.walletMoney-info.orderMoney
            this.show = true
        },
        onConfirm(){
            /* let params = {
                recordId:this.recordId,
                refundMoney:this.refundMoney,
                reason:this.message
            } */
            let formData = new FormData()
            formData.append("recordId",this.recordId)
            formData.append("refundMoney",this.refundMoney)
            formData.append("reason",this.message)
            this.$api.home.refund(formData).then(res=>{
                if(res.code == 200){
                    debugger
                }else{
                    this.$toast(res.message);
                }
                this.loading = false;
            }).catch((res) => {
                this.loading = false;
            });
        },
        onCancel(){
            this.show = false
            this.message = ""
        }
    }
}
</script>
<style lang="less" scoped>
    .detail{
        padding-top: .2rem;
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
    }
</style>