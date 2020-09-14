<template>
    <div>
        <van-nav-bar class="navBar" title="车辆管理" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <van-search
                    v-model="params.licensePlate"
                    placeholder="搜索车牌"
                    @search="onSearch"
                    show-action
                    background="#dcdfe6"
                    >
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="onSearch">搜索</van-button>
                    <van-button class="searchBtn" slot="action" type="info" size="small" @click="addCar">添加月卡车</van-button>
                </van-search>
                <van-row type="flex" justify="center" class="cardHeaderWrap" >
                    <!-- <van-col span="6">部门</van-col> -->
                    <van-col span="8">用户</van-col>
                    <van-col span="8">车牌</van-col>
                    <van-col span="8">到期时间</van-col>
                </van-row>
                <van-row  class="cardWrap  van-coupon" type="flex" justify="center" align="center"
                    v-for="(item,index) in carList" :key='index' 
                    @click='changeState(index)'>
                    <!-- <van-col span="6">{{item.groupName}}</van-col> -->
                    <van-col span="8">{{item.userName}}</van-col>
                    <van-col span="8">{{item.licensePlate}}</van-col>
                    <van-col span="8">{{item.endTime}}</van-col>
                    <template class="btnGroup" v-if='isShow[index]'>                        
                        <van-divider dashed class="divider"/>
                        <van-col span="12">
                            {{item.phone}}
                        </van-col>
                        <van-col span="12">
                            <van-button type="info" @click='delay(item)'>延期</van-button>
                            <van-button type="info" @click='handleDel(item.id)'>删除</van-button>
                        </van-col>
                    </template>
                </van-row>
                <div class="noSearch" v-if="carList.length === 0">暂无查询数据</div>
            </van-list>
        </div>
        <!-- 弹框 -->
        <div class="covers" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>延期处理</header>
                <main>
                    <van-form @submit="saveData" class="formWrap">
                        <van-field name="radio" label="延期类型">
                            <template #input>
                                <van-radio-group v-model="radioVal" direction="horizontal" @change="changeRadio">
                                    <van-radio name="1">套餐延期</van-radio>
                                    <van-radio name="2">自定义</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field name="radio" label="套餐选择" v-if="!subItemShow">
                            <template #input v-if="!subItemShow">
                                <van-radio-group v-model="packageList" direction="horizontal">
                                    <van-radio :name="item" class="radioItem"
                                        v-for="(item,index) in singlePacklist" :key="index">
                                        {{item.name}}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field
                            v-if="subItemShow"
                            v-model="form.rechargeMoney"
                            name="rechargeMoney"
                            label="充值金额"
                            placeholder="请输入充值金额"
                            :rules="[{ required: true, message: '请输入充值金额' }]"
                        />
                        <van-field
                            v-if="subItemShow"
                            readonly
                            clickable
                            name="datetimePicker"
                            :value="form.endDateStr"
                            label="到期时间"
                            placeholder="点击选择到期时间"
                            @click="showPickerEndTime = true"
                            />
                        
                        <van-field
                            v-model="form.memo"
                            name="memo"
                            label="备注"
                            type="textarea"
                            rows="2"
                            autosize
                            placeholder="备注"
                        />
                    </van-form>
                </main>
                <footer>
                    <button @click="saveData">保存</button>
                    <button @click="cancelDialog">取消</button>
                </footer>
            </div>
        </div>
        <van-popup v-model="showPickerEndTime" position="bottom">
            <van-datetime-picker
                type="date"
                @confirm="onConfirmEndTime"
                @cancel="showPickerEndTime = false"
            />
        </van-popup>
</div>
</template>
<script>
import { mapGetters } from "vuex"
import ClickOutside from 'element-ui/src/utils/clickoutside'
export default {
    data(){
        return {
            finished: false,
            loading: false,
            isShow:[],
            carList:[],
            searchVal:'',
            params:{
                licensePlate:'',
                depId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            form:{
                veId:'',
                rechargeMoney:'',
                endDateStr:'',
                memo:""
            },
            radioVal:'1',
            packageList:'',
            singlePacklist:[],
            subItemShow:false,
            showPickerEndTime:false
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    directives: { ClickOutside },
    created() {
        this.params.depId = this.carParkInfo.depId
        this.initData();
    },
    methods: {
        //查询
        onSearch(){
            this.initData();
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }            
            this.initData();
        },
        //数据初始化
        initData(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            console.log(this.params,'params')
            this.$api.home.getCarList(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.carList = this.carList.concat(rows)
                    this.carList.map(o=>this.isShow.push(false))
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.carList.length >= this.total) {
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
        //改变状态
        changeState(index){
            //debugger
            this.isShow.splice(index,1,!this.isShow[index])
        },
        //添加月卡车点击
        addCar(){
            this.$router.push('/addCar')
        },
        //延期
        delay(item){
            this.singlePacklist = item.packageList
            this.radioVal = "1"
            if(this.singlePacklist){
                this.packageList = this.singlePacklist[0]
                this.form={
                    veId:item.id,
                    rechargeMoney:this.singlePacklist[0].price,
                    endDateStr:this.singlePacklist[0].updateTime,
                    memo:''
                }
            }else{
               this.form.veId = item.id
            }
            this.dialogShow = true
        },
        changeRadio(val){
            if(val=='2'){  
                this.form.rechargeMoney = ""
                this.form.endDateStr = ""
                this.subItemShow= true
            }else{
                this.form.rechargeMoney = this.packageList.price
                this.form.endDateStr = this.packageList.updateTime
                this.subItemShow= false
            }
        },
        onConfirmEndTime(val){
            this.form.endDateStr = this.formatDate(val)
            this.showPickerEndTime = false
        },
        //删除
        handleDel(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.home.delCar(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                    this.carList = []
                    this.pageNo = 1
                    this.loading = true
                    this.finished = false;
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //弹窗保存
        saveData(){
            console.log(this.form,'this.form');
            let formData = new FormData();
            formData.append('veId',this.form.veId) 
            formData.append('endDateStr',this.form.endDateStr) 
            formData.append('rechargeMoney',this.form.rechargeMoney) 
            formData.append('memo',this.form.memo) 
            this.$api.home.customRecharge(formData).then(res=>{
                this.dialogShow = true
                if(res.code == 200){
                    this.$toast(res.message);
                    this.carList = []
                    this.pageNo = 1
                    this.loading = true
                    this.finished = false;
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.dialogShow = true
                this.loading = false;
            });
        },
        //弹窗关闭
        cancelDialog(){
            this.dialogShow = false
            this.form={
                veId:"",
                rechargeMoney:'',
                endDateStr:'',
                memo:''
            }
        },
        handleDiaClickOutside(){
            /* if (this.dialogShow) {
                this.dialogShow = false
            } */
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
    .searchBtn{
        margin-right:15px
    }
    .mainWrap{
        .title{
            padding: .3rem 0;
            text-align: center;
        }
        .van-row{
            margin: 0 .3rem;
        }
        .cardHeaderWrap 
        {            
            background-color: #eee;
            &.van-row{                
                margin-top:.2rem;
            }
            .van-col {
                padding: .2rem 0;
                text-align: center;
            }
        }
        
        .cardWrap{
            flex-wrap:wrap;
            margin-top:.2rem;
            padding: 0.2rem 0.1rem;
            /* border: 1px solid #666; */
            box-shadow: 0 0 4px rgba(0,0,0,.5);
            border-radius: 4px;
            text-align: center;
            .van-col {
                padding: .1rem 0;
                text-align: center;
            }
            .divider{
                display: inline-block;
                width: 90%;
                margin: 5px auto;
                border-color: #666;
            }
            .van-button{
                height:.6rem;
            }
            .green{
                color:#1fa10e
            }
            .red{
                color:#ff001f
            }
        }
    }
    .radioItem{
        margin-bottom: 10px;
    }
</style>