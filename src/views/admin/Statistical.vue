<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="统计报表" left-text="返回" left-arrow @click-left="onClickLeft" fixed>
        </van-nav-bar>
        <div class="searchGroup fixedMain"> 
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
            <van-tabs v-model="active">
                <van-tab title="统计图">
                    <van-divider class="lineDivider" ></van-divider>
                    <van-empty description="暂无数据"  v-if="tableData.length==0"/>
                    <div class="chart" id="chart" >
                        
                    </div>
                </van-tab>
                <van-tab title="数据表">
                    <van-divider class="lineDivider"></van-divider>
                    <div class="elTable">
                        <el-table
                            :data="tableData"
                            border
                            size="mini"
                            style="width:99%">
                            <el-table-column
                                prop="days"
                                label="日期"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="monthcar"
                                label="月租充值"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="temporary"
                                label="临时车"
                                align="center"
                                width="60">
                            </el-table-column>
                            <el-table-column
                                prop="train"
                                label="车次"
                                align="center"
                                width="50"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="unlicensed"
                                label="无牌预付"
                                align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import echarts from 'echarts'
import {formatDate} from '@/utils'
export default {
    data(){
        return {
            params:{
                depId:'',
                bTime:"",
                endTime:""
            },
            times:[],
            active:0,
            tableData:[]
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    created() {
        this.params.depId = this.carParkInfo.depId||sessionStorage.getItem('depId')
        let curDate = new Date();
        this.params.bTime = formatDate(new Date(curDate.getTime() - 7*24*60*60*1000));
        this.params.endTime = formatDate(curDate); 
        this.initData();
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        //数据初始化
        initData(){
            if(this.params.bTime == ""){
                this.$toast('请选择开始时间');
                return
            }else if(this.params.endTime == ""){
                this.$toast('请选择结束时间');
                return
            }else if(this.params.bTime>this.params.endTime){
                this.$toast('开始时间不能大于结束时间');
                return
            }
            this.$api.home.getStatisticalData(this.params).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.tableData = res.result
                    this.echartList(this.tableData)
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //查询
        searchData(){            
            this.initData();
        },
        //月报
        reportData(){
            let curDate = new Date();
            this.params.bTime = new Date(curDate.getTime() - 30*24*60*60*1000);
            this.params.endTime = curDate; 
            this.initData(); 
        },
        //绘制柱状图
        echartList(chartArry){
            var dom = document.getElementById("chart");
            var myChart = echarts.init(dom);            
            if(chartArry.length>0){
                myChart.resize({height:400}); 
            }else{
                myChart.resize({height:4}); 
            }
            let daysArry = []
            let monthcarArry = []
            let temporaryArry = []
            let unlicensedArry = []
            let incomeArry = [], refundArry=[],settlementArry=[]
            for (let i = 0; i < chartArry.length; i++) {
                const item = chartArry[i];
                daysArry.push(item.days)
                monthcarArry.push(item.monthcar)
                temporaryArry.push(item.temporary)
                unlicensedArry.push(item.unlicensed)
                incomeArry.push(item.income)
                refundArry.push(item.refund)
                settlementArry.push(item.settlement)
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['月租充值', '临时车', '无牌预付','总金额','退款金额','结算金额']
                },
                xAxis: {
                    type: 'category',
                    data: daysArry
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {   
                        name: '月租充值',
                        data: monthcarArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    },
                    {
                        name: '临时车',
                        data: temporaryArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    },
                    {
                        name: '无牌预付',
                        data: unlicensedArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    },
                    {
                        name: '总金额',
                        data: incomeArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    },
                    {
                        name: '退款金额',
                        data: refundArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    },
                    {
                        name: '结算金额',
                        data: settlementArry,
                        type: 'bar',
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    }
                ]
            };
            myChart.setOption(option, true);
        }
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
    .lineDivider{
        margin-top:0;
    }
    .noData{
        padding-top:.5rem ;
        text-align: center;
    }
    .chart{
        padding-top:.5rem ;
    }
    .elTable{
        padding: .5rem .1rem;
        
    }
</style>
<style lang="less">
    .elTable .el-table .cell{
        padding: 0 3px !important;
    }
</style>