<template>
    <div>
        <van-nav-bar class="navBar" title="会员充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text=""
                @load="onLoad"
                :offset="10"
                >
                <van-card  class="vanCard" >
                    <template #desc>
                        <h2>会员名：13846873541</h2>
                        <p >剩余金额：20.56元</p>
                        <p class="pFooter">
                            <van-button type="info" size="mini" @click="jumpTo">充值</van-button>
                        </p>
                    </template>
                </van-card>
                <div class="noSearch" >暂无查询数据</div>
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
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created(){
        this.params.userId = this.user.id||localStorage.getItem('userId')
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            /* this.$api.owner.getMonthlyCarList(this.params).then(res=>{
                if(res.code == 200){
                    //debugger
                    let rows = res.result; //请求返回当页的列表
                    this.monthlyCarList = rows
                    this.finished = true
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            }); */
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