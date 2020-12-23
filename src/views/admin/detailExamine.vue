<template>
    <div>
        <van-nav-bar class="navBar" title="月租审核" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="examineForm" label-width="80px" size="mini" class="formWrap">
                <el-form-item label="用户姓名">
                    <el-input v-model="examineForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="examineForm.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-model="examineForm.carNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="车场">
                    <el-input v-model="examineForm.carParkName" disabled></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="examineForm.userAddress" disabled></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="examineForm.groupId" placeholder="请选择部门" class="fullWidth">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in groupList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆类型">
                    <el-select v-model="examineForm.carTyme" placeholder="请选择车辆类型" class="fullWidth">
                        <el-option label="月租车" :value="1"></el-option>
                        <el-option label="储值车" :value="2"></el-option>
                        <el-option label="免费车" :value="3"></el-option>
                        <el-option label="临时车" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月卡套餐">
                    <el-checkbox-group v-model="examineForm.packIds">
                        <el-checkbox :label="item.id" name="type" v-for="(item,index) in packageList" :key="index">{{item.name}}</el-checkbox>
                        <!-- <el-checkbox label="地推活动" name="type"></el-checkbox>
                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox> -->
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="收费标准">
                    <el-select v-model="examineForm.freeId" placeholder="请选择收费标准" class="fullWidth">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in feesList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" 
                        v-model="examineForm.startTime" class="fullWidth">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" 
                        v-model="examineForm.endTime" class="fullWidth">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-image :src="examineForm.imgUrl" :fit="fit"  class="fullWidth"></el-image>
                </el-form-item>
                <el-form-item size="mini">
                    <el-button type="primary" @click="onSubmit">通过</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            depId:"",
            carParkName:"",
            info:{},
            feesList:[],
            packageList:[],
            groupList:[],
            examineForm:{
                userName:"",
                phone:"",
                carNum:"",
                carParkName:"",
                userAddress:"",
                groupId:"",
                carTyme:"",
                packIds:[],
                freeId:"",
                startTime:new Date(),
                endTime:new Date(),
                imgUrl:""
            },
            params:{
                applyId:"",
                carTyme:"",
                freeId:"",
                groupId:"",
                packIds:"",
                startTime:"",
                endTime:"",
                remark:"",
                status:2,  //审核意见:2通过，3拒绝  
            }
        }
    },
    computed: {
        ...mapGetters(['carParkInfo'])
    },
    created(){
        this.depId = this.carParkInfo.depId||sessionStorage.getItem('depId')
        this.carParkName = this.carParkInfo.name||sessionStorage.getItem('carParkInfo').name
        this.info = this.$route.query.row
        console.log(this.info,'this.info')
        this.examineForm.userName = this.info.userName
        this.examineForm.phone = this.info.phone
        this.examineForm.carNum = this.info.carNum
        this.examineForm.carParkName = this.carParkInfo.name||sessionStorage.getItem('carParkInfo').name
        this.examineForm.userAddress = this.info.userAddress
        this.examineForm.imgUrl = this.info.imgUrl
        this.initData()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        initData(){
            let params = {
                depId:this.depId
            }
            this.$api.home.getZybFeesList(params).then(res=>{
                if(res.code == 200){
                    this.feesList = res.result.records                   
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
            this.$api.home.getPackageList(params).then(res=>{
                if(res.code == 200){
                    this.packageList = res.result.records                 
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });

            let parm = {
                depId:this.carParkInfo.depId||sessionStorage.getItem('depId'),
            }
            this.$api.home.getGroupList(parm).then(res=>{
                if(res.code == 200){
                    this.arrList = [];
                    this.groupList = this.readNodes(JSON.parse(JSON.stringify(res.result)))
                    console.log(this.groupList,'groupList')                 
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        readNodes (treeData) {
            let obj = {
                id:"",
                name:""
            }
            for (let item of treeData) {
                obj = {
                    id:item.id,
                    name:item.name
                }
                this.arrList.push(obj)
                if (item.childList && item.childList.length) {
                    this.readNodes(item.childList)
                }
            }
            return this.arrList
        },
        onSubmit(){
            console.log(this.examineForm,"examineForm")
        }
    }
}
</script>
<style lang="less" scoped>
    .formWrap{
        display: inline-block;
        width: calc(100% - .6rem);
        margin: 0.3rem;
        padding: .3rem .2rem;
        background-color: #fff;
        border-radius: .1rem;
        box-sizing: border-box;
        .fullWidth{
            width: 100%;
        }
    }
</style>