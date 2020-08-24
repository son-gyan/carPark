<template>
    <div class="pages">
        <el-container>
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
            <el-main>
                <van-grid :gutter="10" :column-num="2">
                    <van-grid-item icon="photo-o" text="设备管理" @click='jumpTo(1)' to="" />
                    <van-grid-item icon="photo-o" text="车辆管理" @click='jumpTo(2)' to="" />
                    <van-grid-item icon="photo-o" text="在场车辆" @click='jumpTo(3)' to="" />
                    <van-grid-item icon="photo-o" text="滞留盘点" @click='jumpTo(4)' to="" />
                    <van-grid-item icon="photo-o" text="黑名单"   @click='jumpTo(5)' to="" />
                    <van-grid-item icon="photo-o" text="统计报表" @click='jumpTo(6)' to="" />
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
            form: { //form表单
                curProject:'',
                carPark:''
            },
            projectLst:[],
            carParkLst:[]
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'depId'])
    },
    created() {
        this.getProject()
    },
    methods: {
        //获取当前项目
        getProject(){
            let params = {
                orgCategory:this.orgCategory,
                pageNo:1,
                pageSize:999
            }
            this.$api.home.getProject(params).then(res=>{
                if(res.code == 200){
                    this.projectLst = res.result.records
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
                    default:
                        break;
                }
            }

        }
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
        .van-grid-item__content--center{
            background-color: #169bd5;
            color:#fff;
            .van-grid-item__text{
                color:#fff;
            }
        }
    }
</style>