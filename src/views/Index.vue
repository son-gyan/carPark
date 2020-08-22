<template>
    <div class="pages">
        <el-container>
            <el-header>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="当前项目：">
                        <el-select v-model="form.curProject" placeholder="请选择当前项目">
                            <el-option :label="item.departName" 
                                :value="item.id" 
                                v-for="(item,index) in projectLst" 
                                :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车场切换：">
                        <el-select v-model="form.carPark" placeholder="请选择车场">
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
                    <van-grid-item icon="photo-o" text="设备管理" to="/deviceManage" />
                    <van-grid-item icon="photo-o" text="车辆管理" to="/carManage" />
                    <van-grid-item icon="photo-o" text="在场车辆" to="/presentCar" />
                    <van-grid-item icon="photo-o" text="滞留盘点" to="/detentionInventory" />
                    <van-grid-item icon="photo-o" text="黑名单" to="/blacklist" />
                    <van-grid-item icon="photo-o" text="统计报表" to="/statistical" />
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
                curProject:'1',
                carPark:'1'
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
                    this.form.curProject = this.projectLst[0].id
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
            let pram = {
                depId:this.depId,
                pageNo:1,
                pageSize:999
            }
            this.$api.home.getCarPark(pram).then(res=>{
                if(res.code == 200){
                    this.carParkLst = res.result.records
                    this.form.carPark = this.carParkLst[0].id
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
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