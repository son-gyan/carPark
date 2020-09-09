<template>
    <div>
        <van-nav-bar class="navBar" title="黑名单" left-text="返回"  right-text="添加"
            left-arrow @click-left="onClickLeft" 
            @click-right="addBlacklist">
        </van-nav-bar>
        <div class="mainWrap">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <div class="van-coupon" v-for="(item,index) in blacklist" :key='index' @click='changeState(index)'>
                    <div class="van-coupon__content">
                        <div class="van-coupon__body">
                            <p class="van-coupon__name">
                                <span>{{item.licensePlate}}</span>
                                <span>截止时间：{{item.deadline}}</span>
                            </p>
                            <p class="van-coupon__valid">备注：{{item.memo}}</p>
                        </div>
                    </div>
                    <p class="van-coupon__description" v-if='isShow[index]'>
                        <van-button type="info" size="mini" @click='delHandle(item.id)'>删除</van-button>
                    </p>
                </div>
                <div class="noSearch" v-if="blacklist.length === 0">暂无查询数据</div>
            </van-list>    
        </div>
        <!-- 弹框 -->
        <div class="covers blacklistDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main>
                    <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                    <van-form @submit="saveData" class="formWrap" :key="+new Date()">
                        <!-- <van-field
                            v-model="form.licensePlate"
                            name="licensePlate"
                            label="车牌："
                            placeholder="请输入车牌"
                            :rules="[{ required: true, message: '请输入车牌' }]"
                        /> -->
                        <van-field
                            readonly
                            clickable
                            name="inTime"
                            :value="form.deadline"
                            label="截止时间"
                            placeholder="点击选择截止时间"
                            :rules="[{ required: true, message: '请选择截止时间' }]"
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
                        <footer>
                            <button native-type="submit">保存</button>
                            <button @click="cancelDialog">取消</button>
                        </footer>
                    </van-form>
                </main>
                
                
            </div>
        </div>
        <van-popup v-model="showPickerEndTime" position="bottom">
            <van-datetime-picker
                type="datetime"
                @confirm="onConfirmEndTime"
                @cancel="showPickerEndTime = false"
            />
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import ClickOutside from 'element-ui/src/utils/clickoutside'
import plateNumber from '@/components/plateNumber'
export default {
    components: {
        plateNumber
    },
    data() {
        return {
            finished: false,
            loading: false,
            isShow:[],
            blacklist:[],
            params:{
                depId:'',
                pageNo:1,
                pageSize:10 
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增黑名单",
            form:{
                depId:'',
                licensePlate:'',
                deadline:'',
                memo:""
            },
            showPickerEndTime:false
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    directives: { ClickOutside },
    created() {
        this.params.depId = this.carParkInfo.depId
        this.form.depId = this.carParkInfo.depId
        this.initData();
    },
    methods: {
        getPlateLicense(data){
            this.form.licensePlate = data
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //添加
        addBlacklist(){
            this.dialogShow = true
            this.dialogTit = "新增黑名单"
            this.form.deadline = this.formatDate(new Date())
        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }            
            this.initData();
        },
        //改变状态
        changeState(index){
            this.isShow.splice(index,1,!this.isShow[index])
        },
        //数据初始化
        initData(){
            this.params.pageNo = this.pageNo
            this.params.pageSize = this.pageSize
            console.log(this.params,'params')
            this.$api.home.getBlacklist(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.blacklist = this.blacklist.concat(rows)
                    this.blacklist.map(o=>this.isShow.push(false))
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.blacklist.length >= this.total) {
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
        //删除
        delHandle(id){
            let formData = {
                id:id
            }
            this.$api.home.delBlacklist(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                    this.blacklist = []
                    this.pageNo = 1
                    this.loading = true
                    this.finished = false;
                    this.initData()
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //弹窗保存
        saveData(){
            if(this.form.licensePlate == ''){
                this.$toast('请输入车牌号')
                return
            }
            console.log(this.form,'this.form');
            this.$api.home.addBlacklist(this.form).then(res=>{
                if(res.code == 200){
                    this.cancelDialog();
                    this.$toast(res.message);
                    this.blacklist = []
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
        //弹窗关闭
        cancelDialog(){
            this.dialogShow = false
            this.form={
                depId:this.carParkInfo.depId,
                licensePlate:'',
                deadline:this.formatDate(new Date()),
                memo:""
            }
        },
        handleDiaClickOutside(){
            /* if (this.dialogShow) {
                this.dialogShow = false
            } */
        },
        onConfirmEndTime(val){
            this.form.deadline = this.formatDate(val)
            this.showPickerEndTime = false
        },
        formatDate(dateTime) {
            let year = dateTime.getFullYear()
            let month = dateTime.getMonth() + 1
            let day = dateTime.getDate()
            let hh = dateTime.getHours();
            let mm = dateTime.getMinutes();
            let ss = dateTime.getSeconds();
            return `${year}-${this.isZero(month)}-${this.isZero(day)}  ${this.isZero(hh)}:${this.isZero(mm)}:${this.isZero(ss)}`;
        },
        isZero(m){
            return m<10?'0'+m:m
        },
    }
}
</script>
<style lang="less" scoped>
    .mainWrap{
        .van-list{            
            padding-top:.2rem;
            .van-coupon__body{
                padding:0 .3rem;
                .van-coupon__name{
                    display: flex;
                    justify-content:space-between;
                }
            }
            .van-coupon__description{
                text-align: right;
            }
        }
    }
    .blacklistDialog .dialog{
        width: 7.3rem;
        margin-bottom: 2rem;
    }
</style>