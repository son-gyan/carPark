<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="发券"  ></van-nav-bar>
        <el-container v-loading="loading" direction="vertical">
            <!-- <el-header></el-header> -->
            <el-main>
                <el-row  gutter="10">
                    <el-col span="24" class="elCol">
                        <div class="cardCoupon">
                            <div class="leftSide">
                                <h3 class="h3">金额券</h3>
                                <p class="p1">优惠券库存剩余：20元</p>
                            </div>
                            <div class="rightSide" @click="toIssueCoupons">
                                去发券
                            </div>
                        </div>
                    </el-col>
                    <el-col span="24" class="elCol">
                        <div class="cardCoupon">
                            <div class="leftSide">
                                <h3 class="h3">金额券</h3>
                                <p class="p1">优惠券库存剩余：20元</p>
                            </div>
                            <div class="rightSide">
                                去发券
                            </div>
                        </div>
                    </el-col>
                    <el-col span="24" class="elCol">
                        <div class="cardCoupon">
                            <div class="leftSide">
                                <h3 class="h3">金额券</h3>
                                <p class="p1">优惠券库存剩余：20元</p>
                            </div>
                            <div class="rightSide">
                                去发券
                            </div>
                        </div>
                    </el-col>
                    <el-col span="24">
                        <div class="cardCoupon">
                            <div class="leftSide">
                                <h3 class="h3">金额券</h3>
                                <p class="p1">优惠券库存剩余：20元</p>
                            </div>
                            <div class="rightSide">
                                去发券
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
            <el-main class="elMain">
                <van-grid :gutter="0" :column-num="3" class="gridGroup" :border="false">
                    <van-grid-item  text="商家库存" @click='jumpTo(1)'  :icon="require('@/assets/images/business/coupons/stock.png')"/>
                    <van-grid-item  text="充值记录" @click='jumpTo(2)'  :icon="require('@/assets/images/business/coupons/rechargeRecord.png')"/>
                    <van-grid-item  text="券发放记录" @click='jumpTo(3)'  :icon="require('@/assets/images/business/coupons/grant.png')"/>
                    <van-grid-item  text="券使用记录" @click='jumpTo(4)'  :icon="require('@/assets/images/business/coupons/usageRecord.png')"/>
                    <van-grid-item  text="券返还记录" @click='jumpTo(5)'  :icon="require('@/assets/images/business/coupons/returnRecord.png')"/>
                    <van-grid-item  text="库存充值" @click='jumpTo(6)'  :icon="require('@/assets/images/business/coupons/inventoryRecharge.png')"/>
                </van-grid>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            loading:false,
            couponList:[],
            params:{
                merId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
        }
    },
    computed: {
        ...mapGetters(["user"])
    },
    created() {
        this.params.merId = this.user.merId||JSON.parse(sessionStorage.getItem('user')).merId
        this.initData();
    },
    methods:{
        initData(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            this.$api.business.listMerDiscountStock(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.couponList = this.couponList.concat(rows)
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.couponList.length >= this.total) {
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
        toIssueCoupons(){
            this.$router.push('/issueCoupons')
        },
        jumpTo(type){
            switch (type) {
                case 1:
                    this.$router.push('/stock')
                    break;
                case 2:
                    this.$router.push('/rechargeRecord')
                    break;
                case 3:
                    this.$router.push('/grant')
                    break;
                case 4:
                    this.$router.push('/usageRecord')
                    break;
                case 5:
                    this.$router.push('/returnRecord')
                    break;
                case 6:
                    this.$router.push('/inventoryRecharge')
                    break;               
                default:
                    break;
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .elMain{            
        width: 93%;
        margin: 3px auto 20px;
        padding: 10px 0;
        background: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        /deep/ .gridGroup{
            .van-grid-item__icon {
                font-size: 1rem;
            }
            .van-grid-item__text{
                font-size: .2rem;
                font-weight: 600;
                text-align: center;
            }
            .van-grid-item__content{
                padding: 10px 8px;
            }
        }
    }
    .elCol{
        margin-bottom: .1rem;
    }
    .cardCoupon{
        display: flex;
        height: 1.5rem;
        color: #fff;
        background: url('../../../assets/images/business/coupons/couponBg.png') center no-repeat;
        background-size: 100% 100%;
        border-radius: .1rem;
        .leftSide{
            display: flex;
            flex:1;
            padding-left: .2rem;
            flex-direction:column;
            justify-content:space-around;
            .h3{
                font-size: .3rem;
            }
            .p1{
                font-size: .1rem;
                color:#F7F55A
            }
        }
        .rightSide{
            display: flex;
            width: 1.9rem;
            font-size: .25rem;
            flex-direction:column;
            justify-content: center;
            align-items: center;
        }
    }    
</style>