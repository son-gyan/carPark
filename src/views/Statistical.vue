<template>
    <div>
        <van-nav-bar class="navBar" title="统计报表" left-text="返回" left-arrow @click-left="onClickLeft" >
        </van-nav-bar>
        <div class="searchGroup">
            <div class="formInline">
                <el-date-picker
                    class="elFormItem"
                    v-model="params.bTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    size="mini"
                    placeholder="开始时间"
                    >
                </el-date-picker>
                <el-date-picker
                    class="elFormItem"
                    v-model="params.endTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    size="mini"
                    placeholder="结束时间"
                    >
                </el-date-picker>
            </div>
            <span class="btnWrap">
                <el-button type="primary" size="mini" @click="searchData">查询</el-button>
                <el-button type="primary" size="mini" @click="reportData">月报</el-button>
            </span>
        </div>
        <van-divider dashed></van-divider>
        <div class="mainWrap">

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            params:{
                depId:'',
                bTime:"",
                endTime:""
            },
            times:[],
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    created() {
        this.params.depId = this.carParkInfo.depId
        this.initData();
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //数据初始化
        initData(){
            this.$api.home.getBlacklist(this.params).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.blacklist = res.result.records
                    this.blacklist.map(o=>this.isShow.push(false))
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //查询
        searchData(){

        },
        //月报
        reportData(){

        },
    }
}
</script>
<style lang="less" scoped>
    .formInline{
        display: flex;
        flex-direction: row;
        height: 1.4rem;
        width: 100%;
        padding-right:0.2rem;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
    }
    .elFormItem{
        flex: 1;
        margin-left: 0.2rem;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.26rem;
        color: #5f5f5f;
        border: 0;
        font-size: 0.26rem;
        border-radius: 0.08rem 0 0 0.08rem;
    }
    .line {
        color: #c6c8c7;
        margin: 0 0.05rem;
    }
    .btnWrap {
        width: 120px;
        margin-left: 0.2rem;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.26rem;
        .el-button+.el-button{
            margin-left:3px;
        }
    }
</style>