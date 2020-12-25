<template>
    <div>
        <van-nav-bar class="navBar" title="库存充值" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <el-form ref="form" :model="form" label-width="0px" size="mini" class="formWrap">
                <el-form-item>
                    <el-select v-model="form.type" placeholder="请选择券类型" class="fullWidth">
                        <el-option label="月租车" :value="1"></el-option>
                        <el-option label="储值车" :value="2"></el-option>
                        <el-option label="免费车" :value="3"></el-option>
                        <el-option label="临时车" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="form.resource">
                        <el-radio label="城市便捷酒店20元/张-定额券"></el-radio>
                        <el-radio label="城市便捷酒店40券40元/张-定额券"></el-radio>
                        <el-radio label="城市便捷酒店60券60元/张-定额券"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item size="mini" style="text-align:center">
                    <el-button round type="primary" @click="onSubmit">支付7元</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            finished: false,
            loading: false,
            form:{
                type:"",
                resource:""
            }
        }
    },
    created(){
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        onSearch(){

        },
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }
            // 异步更新数据
            setTimeout(() => {            
                this.init();
            },500)
        },
        init(){

        }
    }
}
</script>
<style lang="less" scoped>
    body{
        #app{
            .child-view{
                display: inline-block;
                width: 100%;
                .mainWrap{
                    margin-bottom: 0;
                    background-color: #f2f2f2;
                }
            }
        }
    }
    
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
        /deep/ .el-radio{
            padding-bottom: .3rem;
        }
    }
</style>