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
                type="number"
                name="phone"
                label="手机号："
                label-align='right'
                placeholder="请输入手机号"
                :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
                v-model="form.licensePlate"
                name="licensePlate"
                label="车牌号："
                label-align='right'
                placeholder="请输入车牌号"
                :rules="[{ required: true, message: '请填写车牌号' }]"
            />
            <van-field
                readonly
                clickable
                name="datetimePicker"
                :value="form.startTime"
                label="开始时间："
                placeholder="点击选择开始时间"
                @click="showPickerStartTime = true"
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
            <van-field name="packageList" label="月卡套餐：">
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
export default {
    data() {
        return {
            form:{
                depId:'',
                userName:'',
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
                ownerId:''
            },
            feesVal:'',
            feesList:[],
            packageList:[],
            showPickerStartTime:false,
            showPickerEndTime:false,
            showPickerFees:false
        };
    },
    computed: {
        ...mapGetters(['carParkInfo','user'])
    },
    created() {
        this.form.depId = this.carParkInfo.depId
        this.form.parkId = this.carParkInfo.id
        this.form.ownerId = this.user.id
        this.initData()
    },
    methods: {
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
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSubmit(values) {        
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