<template>
    <div>
        <van-nav-bar class="navBar" title="会员充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list>
                <van-card  class="vanCard" >
                    <template #desc>
                        <h2>会员名：{{user.phone}}</h2>
                        <p >剩余金额：{{vipMoney}}元</p>
                        <p class="pFooter">
                            <van-button type="info" size="mini" @click="jumpTo">充值</van-button>
                        </p>
                    </template>
                </van-card>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return{
            finished: false,
            loading: false,
            params:{
                userId:""
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            vipMoney:0
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created(){
        this.params.userId = this.user.id||sessionStorage.getItem('userId')
        this.vipMoney = sessionStorage.setItem('vipMoney')
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
        },
        jumpTo(){
            this.$router.push('/rechargePackage')
        }
    }
}
</script>
<style lang="less" scoped>
    .mainWrap{
        .van-card{
            p{
                font-size: .3rem;
            }
            .pFooter{
                text-align: right;
            }
        }
    }
</style>