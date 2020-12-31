<template>
    <div class="issue">
        <van-nav-bar class="navBar" title="宴会发券" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" size="small" class="formWrap" label-width="1.5rem" style="width:90%;">
                <el-form-item label="券类型">
                    <el-select v-model="form.quotaType" placeholder="请选择券类型">
                        <el-option label="时长券" value="2"></el-option>
                        <el-option label="金额券" value="3"></el-option>
                        <el-option label="次券" value="4"></el-option>
                        <el-option label="定额券" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="券数量">
                    <el-input v-model="form.quotaNum" placeholder="请输入券数量"></el-input>
                </el-form-item>
                <el-form-item label="时长/小时">
                    <el-input v-model="form.quotaNum" placeholder="请输入时长"></el-input>
                </el-form-item>
                <el-form-item label="失效时间">

                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            form:{
                merchantsId: "",
                quotData: "",
                quotaName: "",
                quotaNum: "",
                quotaType: "",
                invalidTime: ""
            }
        }
    }
}
</script>