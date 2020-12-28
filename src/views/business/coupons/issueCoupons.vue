<template>
    <div class="issue">
        <van-nav-bar class="navBar" title="填写券信息" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap">
                <el-form-item class="verticalShow">
                    <div slot="label" class="formLabel">请输入车牌<span class="rLabel">金额券库存剩余20元</span><span class="rLabel">时长券库存剩余20时</span></div>
                    <plateNumber @getPlateLicense="getPlateLicense" :noLabel='true'></plateNumber>
                </el-form-item>
                <el-form-item class="elFormItem1">
                    <div class="formLabel">无车牌<span class="lLabel"><el-checkbox v-model="checked"></el-checkbox></span></div>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入电话号码" v-model="form.phone">
                        <template slot="prepend">请输入电话号码：</template>
                    </el-input>
                </el-form-item>
                <el-form-item class="verticalShow">
                    <div slot="label" class="formLabel">请选择金额/元</div>
                    <van-grid :column-num="3" gutter="20" >
                        <van-grid-item  :text="item"  v-for="(item,index) in moneyList" :key="index" 
                            @click="selectMoney(index,$event)" :class="['vanGridItem',{selectedColor:index==curSelectIndex}]"/>
                    </van-grid>
                </el-form-item>
                <el-form-item class="verticalShow">
                    <div slot="label" class="formLabel">请选择时长/时</div>
                    <van-grid :column-num="3" gutter="20" >
                        <van-grid-item  :text="item"  v-for="(item,index) in timeList" :key="index" 
                            @click="selectMoney(index,$event)" :class="['vanGridItem',{selectedColor:index==curSelectIndex}]"/>
                    </van-grid>
                </el-form-item>
                <el-form-item size="small" style="text-align:center;margin-top:20px">
                    <el-button round type="primary" @click="onSubmit" class="btnIssue">确认</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import plateNumber from '@/components/plateNumber'
export default {
    components: {
        plateNumber
    },
    data(){
        return {
            curSelectIndex:-1,
            moneyList:["10元","30元","50元","100元","300元","自定义"],
            timeList:['1小时','3小时','5小时','10小时','12小时','自定义'],
            options:"",
            form:{
                licensePlate:"",
                phone:"",
            }
        }
    },
    methods: {
        getPlateLicense(data){
            console.log('组件传出的data',data)
            this.form.licensePlate = data
        },
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        selectMoney(index,event){
            this.curSelectIndex=index
            //获取点击对象     
            let el = event.currentTarget;
            this.options = el.innerHTML
        },
    }
}
</script>
<style lang="less" scoped>
    .issue{
        .formWrap{
            margin:.3rem;
            .elFormItem1{
                margin-bottom: 0;
                .lLabel{
                    margin-left:.1rem;
                }
            }
            .verticalShow{
                margin-bottom: 10px;
                /deep/ .el-form-item__label{
                    width: 100% !important;
                }
                /deep/ .el-form-item__content{
                    display: inline-block;
                    width: 100% ;
                    margin-left:0 !important;
                }
                .formLabel{
                    width: 100%;
                    font-size: 0.3rem;
                    padding-bottom: 0;
                    text-align: left;                    
                    .rLabel{
                        font-size:.2rem;
                        float: right;
                    }
                }
            }
            /deep/ .el-input-group__prepend{
                padding: 0 8px;
            }
            /deep/ .van-grid-item__content--center{
                background-color: #fff;
            }
            .selectedColor{
                /deep/ .van-grid-item__content--center{
                    background-color: #1989fa;
                    color:#fff;
                    .van-grid-item__text{
                        color:#fff;
                    }
                }
            }
            .btnIssue{
                width: 3rem;
            }
        }
        /deep/ .wrap{
            padding-left:0;
            padding-right:0;
            background-color: transparent;
            .num-box{
                width: 100%;
            }
        }
    }
</style>