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
                    <van-col span="12">                        
                        <van-col span="12">{{user.phone}}</van-col>
                        <van-col span="12" class="center">{{departName}}</van-col>
                        <van-col span="12">{{user.username}}</van-col>
                        <van-col span="12" class="center">管理员</van-col>
                    </van-col>
                </van-row>
                <el-form ref="form" :model="form" label-width="120px" size="mini" class="elForm">
                    <el-form-item label="当前项目：">
                        <el-select v-model="form.curProject" @change="changeProject" placeholder="请选择当前项目" >
                            <el-option :label="item.departName" 
                                :value="item.id" 
                                v-for="(item,index) in projectLst" 
                                :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车场切换：">
                        <el-select v-model="form.carPark" @change="changeCarPark" placeholder="请选择车场">
                            <el-option :label="item.name" 
                                :value="item.id" 
                                v-for="(item,index) in carParkLst" 
                                :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main class="elMain">
                <h3 class="tit">车场管理</h3>
                <van-grid :gutter="0" :column-num="4" class="gridGroup" :border="false">
                    <van-grid-item  text="设备管理" @click='jumpTo(1)'  :icon="require('../../assets/images/device.png')"/>
                    <van-grid-item  text="车辆管理" @click='jumpTo(2)'  :icon="require('../../assets/images/carManager.png')"/>
                    <van-grid-item  text="预付退款" @click='jumpTo(8)'  :icon="require('../../assets/images/refund.png')"/>
                    <van-grid-item  text="滞留盘点" @click='jumpTo(4)'  :icon="require('../../assets/images/detentionInventory.png')"/>
                    <van-grid-item  text="在场车辆" @click='jumpTo(3)'  :icon="require('../../assets/images/presentCar.png')"/>
                    <van-grid-item  text="进出记录" @click='jumpTo(9)'  :icon="require('../../assets/images/inOut.png')"/>
                    <van-grid-item  text="支付记录" @click='jumpTo(10)'  :icon="require('../../assets/images/payRecords.png')"/>
                    <van-grid-item  text="预约车场" @click='jumpTo(7)'  :icon="require('../../assets/images/orderCar.png')"/>
                    <van-grid-item  text="黑名单"   @click='jumpTo(5)'  :icon="require('../../assets/images/blacklist.png')"/>
                    <van-grid-item  text="统计报表" @click='jumpTo(6)'  :icon="require('../../assets/images/statistical.png')"/>
                    <van-grid-item  text="会员管理(集团)" @click='jumpTo(11)'  :icon="require('../../assets/images/member.png')"/>
                    <van-grid-item  text="月租审核" @click='jumpTo(12)'  :icon="require('../../assets/images/examine.png')"/>
                </van-grid>
                <!-- <van-grid :gutter="5" :column-num="3" class="vanGrid">
                    <van-grid-item  text="黑名单"   @click='jumpTo(5)' to="" />
                    <van-grid-item  text="统计报表" @click='jumpTo(6)' to="" />
                    <van-grid-item  text="预约车场" @click='jumpTo(7)' to="" />
                </van-grid> -->
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
        this.getProject()
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
                window.location.origin + "/login?openid="+this.user.openid
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
            height:auto !important;
            padding: 0;            
            padding-top:0.5rem;
            border-bottom: 1px solid #eee;
        }
        .elMain{            
            width: 93%;
            margin: 3px auto 20px;
            padding: 10px 0;
            background: #fff;
            border-radius: 5px;
            box-sizing: border-box;
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
                    font-size: .3rem;
                    font-weight: bold;
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