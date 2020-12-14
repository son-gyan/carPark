<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="首页"  >
            <template #right>
                <!-- <span class="span">{{user.username}}</span> -->
                <span class="span" @click="logout" style="margin-left:10px;">切换账号<van-icon :name="require('../../assets/images/changeAccout.png')" /></span>
            </template>
        </van-nav-bar>
        <el-container v-loading="loading">
            <el-header class="elHead">
                <van-row type="flex" justify="center" align="center">
                    <van-col span="4">
                        <van-image
                            round
                            width="1rem"
                            height="1rem"
                            src="https://img.yzcdn.cn/vant/cat.jpeg"
                            />
                    </van-col>
                    <van-col span="16">                        
                        <van-col span="24">13045687912</van-col>
                        <van-col span="24">微信号：wxy1234567895</van-col>
                        <van-col span="24">已绑车辆：鄂E88888 鄂E88888 鄂E88888 鄂E88888 鄂E88888</van-col>
                    </van-col>
                </van-row>
                <el-form ref="form" :model="form" label-width="0" size="mini" class="elForm">
                    <el-form-item>
                        <div class="info">
                            <p class="p1">我的VIP特权</p>
                            <p class="p2"><van-icon class="memberIcon" :name="require('@/assets/images/icon-member.png')" />智泊云停车会员</p>
                            <p class="p3"><el-progress :percentage="50" color="#fff" :text-inside="true"></el-progress></p>
                            <p class="p1">会员余额：123.00元 <span class="fr">加入日期：2019.01.01</span></p>
                        </div>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main class="elMain elMainHead">
                <van-grid  :column-num="3" class="gridGroup">
                    <van-grid-item  text="月卡" @click='jumpTo(5)' >
                        <template slot="icon">
                            <div>1</div>
                        </template>
                    </van-grid-item>
                    <van-grid-item  text="积分" @click='jumpTo(6)' >
                        <template slot="icon">
                            <div>100</div>
                        </template>
                    </van-grid-item>
                    <van-grid-item  text="优惠券" @click='jumpTo(7)' >
                        <template slot="icon">
                            <div>0</div>
                        </template>
                    </van-grid-item>
                </van-grid>
            </el-main>
            <el-main class="elMain">
                <van-grid :gutter="0" :column-num="4" class="gridGroup" :border="false">
                    <van-grid-item  text="设备管理" @click='jumpTo(1)'  :icon="require('../../assets/images/device.png')"/>
                    <van-grid-item  text="车辆管理" @click='jumpTo(2)'  :icon="require('../../assets/images/carManager.png')"/>
                    <van-grid-item  text="预付退款" @click='jumpTo(8)'  :icon="require('../../assets/images/refund.png')"/>
                    <van-grid-item  text="滞留盘点" @click='jumpTo(4)'  :icon="require('../../assets/images/detentionInventory.png')"/>
                    <van-grid-item  text="在场车辆" @click='jumpTo(3)'  :icon="require('../../assets/images/presentCar.png')"/>
                    <van-grid-item  text="进出场记录" @click='jumpTo(9)'  :icon="require('../../assets/images/inOut.png')"/>
                    <van-grid-item  text="支付记录" @click='jumpTo(10)'  :icon="require('../../assets/images/payRecords.png')"/>
                    <van-grid-item  text="预约车场" @click='jumpTo(7)'  :icon="require('../../assets/images/orderCar.png')"/>
                    <van-grid-item  text="黑名单"   @click='jumpTo(5)'  :icon="require('../../assets/images/blacklist.png')"/>
                    <van-grid-item  text="统计报表" @click='jumpTo(6)'  :icon="require('../../assets/images/statistical.png')"/>
                    <van-grid-item  text="会员管理(集团)" @click='jumpTo(11)'  :icon="require('../../assets/images/member.png')"/>
                    <van-grid-item  text="月租审核" @click='jumpTo(12)'  :icon="require('../../assets/images/examine.png')"/>
                </van-grid>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            loading:false,
            form: { //form表单
                curProject:'',
                carPark:''
            },
            projectLst:[],
            carParkLst:[],
            departName:sessionStorage.getItem('departName')
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'depId','user'])
    },
    created() {
        //this.getProject()
    },
    methods: {
        //获取当前项目
        getProject(){
            this.loading = true;
            let params = {
                orgCategory:this.orgCategory||sessionStorage.getItem('orgCategory'),
                pageNo:1,
                pageSize:999
            }
            this.$api.home.getProject().then(res=>{
                if(res.code == 200){
                    this.projectLst = res.result
                    if(this.projectLst.length>0){
                        this.form.curProject = this.projectLst[0].id
                        this.changeProject(this.projectLst[0].id)
                    }                    
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //当前项目切换
        changeProject(val){
            let pram = {
                depId:val,
                pageNo:1,
                pageSize:999
            }            
            this.$store.dispatch('setDepId', val)
            this.$api.home.getCarPark(pram).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.carParkLst = res.result.records
                    if(this.carParkLst.length>0){                        
                        this.form.carPark = this.carParkLst[0].id
                    }else{
                        this.form.carPark = '';
                    }
                    this.changeCarPark(this.form.carPark)
                    console.log(this.form.carPark,'form.carPark')
                }else{                    
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //车场切换
        changeCarPark(id){
            for (let i = 0; i < this.carParkLst.length; i++) {
                const item = this.carParkLst[i];
                if(id==item.id){             
                    this.$store.dispatch('setCarParkInfo', item)
                }
            }
        },
        jumpTo(type){
            if(this.form.carPark == ''){
                this.$toast('请选择车场');
                return
            }else{
                switch (type) {
                    case 1:
                        this.$router.push('/deviceManage')
                        break;
                    case 2:
                        this.$router.push('/carManage')
                        break;
                    case 3:
                        this.$router.push('/presentCar')
                        break;
                    case 4:
                        this.$router.push('/detentionInventory')
                        break;
                    case 5:
                        this.$router.push('/blacklist')
                        break;
                    case 6:
                        this.$router.push('/statistical')
                        break;                
                    case 7:
                        this.$router.push('/order')
                        break;                
                    case 8:
                        this.$router.push('/refund')
                        break;                
                    case 9:
                        this.$router.push('/inOut')
                        break;                
                    case 10:
                        this.$router.push('/payRecords')
                        break;                
                    case 11:
                        this.$router.push('/member')
                        break;                
                    case 12:
                        this.$router.push('/examine')
                        break;                
                    default:
                        break;
                }
            }

        },
        logout(){
            window.location.replace(
                window.location.origin + "/loginOwner?openid="+this.user.openid
            );
        }
    },
    beforeRouteEnter  (to, from, next) {
        next(vm => {
            if (from.name === 'login') {
                vm.projectLst = []
                vm.getProject()
            }
        })
    },
}
</script>
<style lang="scss" scoped>
    #app .pages{
        height:auto;
        /deep/ .el-header{
            height:150px !important;
            padding: 0;            
            padding-top:0.5rem;
            border-bottom: 1px solid #eee;
        }
        .elHead .elForm{
            margin-top: 20px;
            .info{
                .p1{
                    font-size: .2rem;
                }                
                .memberIcon{
                    vertical-align: middle;
                }
                /deep/ .el-progress-bar__outer{
                    background-color: #ccc;
                }
                .fr{
                    float: right;
                }
            }
        }
        .elMain{            
            width: 93%;
            margin: 3px auto 20px;
            padding: 10px 0;
            background: #fff;
            border-radius: 5px;
            box-sizing: border-box;
            &.elMainHead{
                margin: 90px auto 10px;;
                padding: 0;
            }
            .tit{
                font-size: .35rem;
                padding: 10px 0;
                text-align: center;
            }
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
        .van-grid{
            /* margin-top:.5rem;
            box-shadow: 0 2px 11px rgba(0,0,0,.6); */
        }
        .vanGrid{
            margin-top:.1rem;
            /deep/.van-grid-item__content--center{
                height:2.3rem;
            }
        }
        .van-grid-item__content--center{
            /* height:2.8rem;
            background-color: #1989fa;
            color:#fff;
            .van-grid-item__text{
                color:#fff;
                font-size: .3rem;
                font-weight: bold;
            } */
        }
        .navBar{
            .span{
                color:#fff;
            }
        }
    }
</style>
<style lang="scss" scoped>
.pages{
    .navBar{
       /deep/ .van-ellipsis{
           margin-left: 1rem;
        }
    }
}
</style>