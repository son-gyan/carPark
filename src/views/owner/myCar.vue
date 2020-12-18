<template>
    <div>
        <van-nav-bar class="navBar" title="我的车辆" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <div class="addCar" @click="addCar">
                <van-icon name="plus" />添加车辆
            </div>
            <van-card
                class="vanCard"
                v-for="(item,index) in myCarList"  :key="index"
                :thumb="require('../../assets/images/defaultImg.png')"
                >
                <template #desc>
                    <p >车牌：{{item.carNum}}</p>
                    <p >车辆颜色：{{item.colour}}</p>
                    <p class="pFooter">
                        <van-button type="info" size="mini" @click="delMyCar(item)">删除</van-button>
                    </p>
                </template>
                <template #footer>
                </template>
            </van-card>
            <div class="noSearch" v-if="myCarList.length==0">暂无查询数据</div>
        </div>
        <!-- 弹框 -->
        <div class="covers mycarDialog" v-show="dialogShow">
            <div class="dialog" v-click-outside:dialog="handleDiaClickOutside">
                <header>{{dialogTit}}</header>
                <main class="dialogMain">
                    <el-form ref="form" :model="form" label-width="100px" size="mini">
                        <el-form-item label="车辆颜色：">
                            <el-select v-model="form.colour" placeholder="请选择车辆颜色">
                                <el-option :label="item" :value="item" v-for="item in columns" :key="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="carNum">
                            <plateNumber v-if="dialogShow" @getPlateLicense="getPlateLicense"></plateNumber>
                        </div>                        
                        <el-form-item>
                            <el-button type="primary" @click="saveData">保存</el-button>
                            <el-button @click="cancelDialog">取消</el-button>
                        </el-form-item>
                    </el-form>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
import ClickOutside from 'element-ui/src/utils/clickoutside'
import plateNumber from '@/components/plateNumber'
export default {
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
        plateNumber
    },
    computed: {
        ...mapGetters(['user'])
    },
    data(){
        return {
            finished: false,
            loading: false,
            myCarList:[],
            params:{
                userId:""
            },
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
            dialogShow:false,
            dialogTit:"新增我的车辆",
            showPickerColor:false,
            form:{
                userId:'',
                carNum:'',
                colour:''
            },
            columns:['红色','绿色','白色','橙色']
        }
    },
    directives: { ClickOutside },
    created() {
        this.params.userId = this.user.id
        this.form.userId  = this.user.id
        this.initData();
    },
    methods: {
        getPlateLicense(data){
            this.form.carNum = data
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //初始化
        initData(){
            this.myCarList = []
            this.$api.owner.getMyCarList(this.params).then(res=>{
                if(res.code == 200){
                    if(res.result&&res.result.length>0){
                        let rows = res.result; //请求返回当页的列表
                        this.myCarList = rows
                    }                    
                }else{
                    this.$toast(res.message);
                }
                this.loading = false;
            }).catch((res) => {
                this.loading = false;
            });
        },
        addCar(){
            this.dialogShow = true
        },
        saveData(){
            if(this.form.carNum == ''){
                this.$toast('请输入车牌号')
                return
            }else if(this.form.carNum.length < 7){
                this.$toast('请输入正确的车牌号')
                return
            }else if(this.form.colour==""){
                this.$toast('请选择车辆颜色')
                return
            }
            let formData = new FormData();
                formData.append('userId',this.form.userId)
                formData.append('carNum',this.form.carNum)
                formData.append('colour',this.form.colour)
            this.$api.owner.addMyCar(formData).then(res=>{
                if(res.code == 200){
                    this.cancelDialog();
                    this.$toast(res.message);
                    this.loading = true
                    this.initData();
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        cancelDialog(){
            this.dialogShow = false
            this.form.colour = ""
            this.form.carNum = ""
        },
        delMyCar(item){
            let formData = new FormData();
                formData.append('id',item.id)
            this.$api.owner.delMyCar(formData).then(res=>{
                if(res.code == 200){
                    this.cancelDialog();
                    this.$toast(res.message);
                    this.loading = true
                    this.myCarList = []
                    this.initData();
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
<style lang="less" scoped>
    .dialogMain{
        padding: .3rem 0;
        /deep/ .wrap{
            .card-header{
                margin-right:0
            }
        }
    }
    .searchBtn{
        margin-right:15px
    }
    .mainWrap{
        .addCar{
            width: 90%;
            padding: .3rem 0;
            margin:.1rem auto;
            text-align: center;
            border:1px dashed #666;
        }
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
            padding: .1rem 0;
            border: 1px solid #666;
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
        .van-card{
            p{
                font-size: .3rem;
            }
            .pFooter{
                text-align: right;
            }
        }
    }
    .radioItem{
        margin-bottom: 10px;
    }
    .mycarDialog.covers .dialog{
        width: 7.3rem;
        margin-bottom: 5rem;
    }

    
</style>