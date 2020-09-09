<template>
    <div>
        <van-nav-bar class="navBar" title="添加月卡" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-form @submit="onSubmit" class="formWrap">
            <van-field
                v-model="form.userName"
                name="userName"
                label="用户名称："
                label-align='right'
                placeholder="请输入用户名称"
                :rules="[{ required: true, message: '请填写用户名称' }]"
            />
            <van-field
                v-model="form.phone"
                type="tel"
                name="phone"
                label="手机号："
                label-align='right'
                placeholder="请输入手机号"
                :rules="[
                    { required: true, message: '请填写手机号' },
                    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}
                ]"
            />
            <!-- <van-field
                v-model="form.licensePlate"
                name="licensePlate"
                label="车牌号："
                label-align='right'
                placeholder="请输入车牌号"
                :rules="[{ required: true, message: '请填写车牌号' }]"
            /> -->
            <plateNumber @getPlateLicense="getPlateLicense"></plateNumber>
            <van-field
                readonly
                clickable
                name="picker"
                :value="groupVal"
                label="部门："
                label-align='right'
                placeholder="点击选择部门"
                @click="showGroup = true"
                :rules="[{ required: true, message: '请选择部门' }]"
                />
            <van-popup v-model="showGroup" position="bottom">
                <van-picker
                    show-toolbar
                    value-key="name"
                    :columns="columnsGroup"
                    @confirm="confirmGroup"
                    @cancel="showGroup = false"
                />
            </van-popup>
            <van-field
                readonly
                clickable
                name="datetimePicker"
                :value="form.startTime"
                label="开始时间："
                placeholder="点击选择开始时间"
                @click="showPickerStartTime = true"
                :rules="[{ required: true, message: '请选择开始时间' }]"
                />
            <van-popup v-model="showPickerStartTime" position="bottom">
                <van-datetime-picker
                    type="date"
                    @confirm="onConfirmStartTime"
                    @cancel="showPickerStartTime = false"
                />
            </van-popup>
            <van-field
                readonly
                clickable
                name="datetimePicker"
                :value="form.endTime"
                label="结束时间："
                placeholder="点击选择结束时间"
                @click="showPickerEndTime = true"
                :rules="[{ required: true, message: '请选择结束时间' }]"
                />
            <van-popup v-model="showPickerEndTime" position="bottom">
                <van-datetime-picker
                    type="date"
                    @confirm="onConfirmEndTime"
                    @cancel="showPickerEndTime = false"
                />
            </van-popup>
            <van-field
                readonly
                clickable
                name="picker"
                :value="feesVal"
                label="收费标准："
                placeholder="点击选择收费标准"
                @click="showPickerFees = true"
                :rules="[{ required: true, message: '请选择收费标准' }]"
                />
            <van-popup v-model="showPickerFees" position="bottom">
                <van-picker
                    show-toolbar
                    value-key="name"
                    :columns="feesList"
                    @confirm="onConfirmFees"
                    @cancel="showPickerFees = false"
                />
            </van-popup>
            <van-field name="packageList" label="月卡套餐：" :rules="[{ required: true, message: '请选择月卡套餐' }]">
                <template #input>
                    <van-checkbox-group v-model="form.packageList" direction="horizontal">
                        <van-checkbox :name="item" shape="square" 
                            v-for="(item,index) in packageList"
                            :key="index">
                            {{item.name}}
                        </van-checkbox>
                    </van-checkbox-group>
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button block type="info" native-type="submit">
                提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import plateNumber from '@/components/plateNumber'
export default {
    components: {
        plateNumber
    },
    data() {
        return {
            form:{
                depId:'',
                groupId:'',
                userName:'',
                nickname:'',
                phone:'',
                licensePlate:'',
                startTime:'',
                endTime:'',
                feesId:'',
                packageList:[],
                status:1,
                isOpen:1,
                parkId:'',
                chargeType:1,
                ownerId:'',
                memo:''
            },
            groupVal:'',
            feesVal:'',
            feesList:[],
            packageList:[],
            columnsGroup:[],
            showGroup:false,
            showPickerStartTime:false,
            showPickerEndTime:false,
            showPickerFees:false,
            arrList:[]
        };
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo','user'])
    },
    created() {
        this.form.depId = this.carParkInfo.depId
        this.form.parkId = this.carParkInfo.id
        //this.form.ownerId = this.user.id
        this.initData()
        let curDate = new Date();
        this.form.startTime = this.formatDate(curDate)
        this.form.endTime = this.formatDate(new Date(curDate.getTime() + 30*24*60*60*1000));
    },
    methods: {
        getPlateLicense(data){
            console.log('组件传出的data',data)
            this.form.licensePlate = data
        },
        initData(){
            let params = {
                depId:this.carParkInfo.depId,
                pageNo:1,
                pageSize:999
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
                depId:this.carParkInfo.depId,
            }
            this.$api.home.getGroupList(parm).then(res=>{
                if(res.code == 200){
                    this.arrList = [];
                    this.columnsGroup = this.readNodes(JSON.parse(JSON.stringify(res.result)))
                    console.log(this.columnsGroup,'columnsGroup')                 
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
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSubmit(values) {        
            if(this.form.licensePlate == ''){
                this.$toast('请输入车牌号')
                return
            }
            console.log('submitForm', this.form);
            this.$api.home.addCar(this.form).then(res=>{
                if(res.code == 200){
                    this.$router.go(-1)                
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        confirmGroup(val){
            this.form.groupId = val.id
            this.groupVal = val.name
            this.showGroup = false
        },
        onConfirmStartTime(val){
            this.form.startTime = this.formatDate(val)
            this.showPickerStartTime = false
        },
        onConfirmEndTime(val){
            this.form.endTime = this.formatDate(val)
            this.showPickerEndTime = false
        },
        onConfirmFees(val){
            this.form.feesId = val.id
            this.feesVal = val.name
            this.showPickerFees = false
        },
        formatDate(date) {
            let year = date.getFullYear()
            let month = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)
            let day = date.getDate()<10?'0'+date.getDate():date.getDate()
            return `${year}-${month}-${day}`;
        },
    },
}
</script>
<style lang="less" scoped>
    .formWrap{
        margin:0.3rem 0;
    }
</style>