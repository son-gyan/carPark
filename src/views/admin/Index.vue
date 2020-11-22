<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="首页"  >
            <template #right>
                <span class="span">{{user.username}}</span>
                <span class="span" @click="logout" style="margin-left:10px;">切换账号</span>
            </template>
        </van-nav-bar>
        <el-container v-loading="loading">
            <el-header>
                <el-form ref="form" :model="form" label-width="120px">
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
                <van-grid :gutter="5" :column-num="2">
                    <van-grid-item  text="设备管理" @click='jumpTo(1)' to="" />
                    <van-grid-item  text="车辆管理" @click='jumpTo(2)' to="" />
                    <van-grid-item  text="在场车辆" @click='jumpTo(3)' to="" />
                    <van-grid-item  text="滞留盘点" @click='jumpTo(4)' to="" />
                    <!-- <van-grid-item  text="黑名单"   @click='jumpTo(5)' to="" />
                    <van-grid-item  text="统计报表" @click='jumpTo(6)' to="" /> -->
                </van-grid>
                <van-grid :gutter="5" :column-num="3" class="vanGrid">
                    <van-grid-item  text="黑名单"   @click='jumpTo(5)' to="" />
                    <van-grid-item  text="统计报表" @click='jumpTo(6)' to="" />
                    <van-grid-item  text="预约车场" @click='jumpTo(7)' to="" />
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
            carParkLst:[]
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
<style lang="scss">
    .pages{
        .el-header{
            height:auto !important;
            padding: 0;            
            padding-top:0.5rem;
            border-bottom: 1px solid #eee;
        }
        .elMain{
            padding:0;
        }
        .van-grid{
            margin-top:.5rem;
            /* box-shadow: 0 2px 11px rgba(0,0,0,.6); */
        }
        .vanGrid{
            margin-top:.1rem;
            /deep/.van-grid-item__content--center{
                height:2.3rem;
            }
        }
        .van-grid-item__content--center{
            height:2.8rem;
            background-color: #1989fa;
            color:#fff;
            .van-grid-item__text{
                color:#fff;
                font-size: .3rem;
                font-weight: bold;
            }
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