<template>
    <div class="whiteBg">
        <van-nav-bar class="navBar" title="设备管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-list
                :finished="finished"
                :immediate-check="false"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="10"
                >
                <div class="title">车场名称：{{carParkInfo.name}}</div>
                <van-row type="flex" justify="center" class="cardHeaderWrap" >
                    <van-col span="8">类型</van-col>
                    <van-col span="8">在线状态</van-col>
                    <van-col span="8">心跳时间</van-col>
                </van-row>
                <div class="list" v-for="(item,index) in deviceList" :key='index'>
                    <van-row  class="cardWrap van-coupon" type="flex" justify="center" align="center" @click='changeState(index)'>
                        <van-col span="8">{{item.laneName}}</van-col>
                        <van-col span="8" class="red" v-if='item.onlineStatus==2'>离线</van-col>
                        <van-col span="8" class="green" v-if='item.onlineStatus==1'>在线</van-col>
                        <van-col span="8">{{item.heartBeatTime}}</van-col>
                        <template class="btnGroup" v-if='isShow[index]'>                        
                            <van-divider dashed class="divider"/>
                            <van-col span="8">
                                <van-button type="info" @click='gateOpen(item.laneId)'>开闸</van-button>
                            </van-col>
                            <van-col span="8">
                                <van-button type="info" @click='gateClose(item.laneId)'>关闸</van-button>
                            </van-col>
                            <van-col span="8">
                                <van-button type="info" @click='restart(item.laneId)'>重启</van-button>
                            </van-col>
                        </template>
                    </van-row>
                </div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data () {
        return {
            finished: false,
            loading: false,
            deviceList:[],
            isShow:[],
            pageNo: 1,//请求第几页
            pageSize: 10,//每页请求的数量
            total: 0,//总共的数据条数
        }
    },
    computed: {
        ...mapGetters(["orgCategory",'carParkInfo'])
    },
    created() {
        this.initData();
    },
    methods: {
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
            let params = {
                depId:this.carParkInfo.depId||sessionStorage.getItem('depId'),
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            this.$api.home.getDeviceList(params).then(res=>{
                if(res.code == 200){
                    this.loading = false;
                    this.total = res.result.total
                    let rows = res.result.records; //请求返回当页的列表
                    if (rows == null || rows.length === 0) {
                        // 加载结束
                        this.finished = true;
                        return;
                    }
                    this.deviceList = this.deviceList.concat(rows)
                    this.deviceList.map(o=>this.isShow.push(false))
                    //如果列表数据条数>=总条数，不再触发滚动加载
                    if (this.deviceList.length >= this.total) {
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
        //开闸
        gateOpen(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.home.gateOpen(formData).then(res=>{
                if(res.code == 200){
                    this.$toast('开闸'+res.message);
                    this.deviceList= []
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
        //关闸
        gateClose(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.home.gateClose(formData).then(res=>{
                if(res.code == 200){
                    this.$toast('关闸'+res.message);
                    this.deviceList= []
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
        //重启
        restart(id){
            let formData = new FormData();
            formData.append('id',id)
            this.$api.home.restart(formData).then(res=>{
                if(res.code == 200){
                    this.$toast('重启'+res.message);
                    this.deviceList= []
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

    }
}
</script>
<style lang="less" scoped>
    body{
        #app{
            height:auto;
            .child-view{
                display: inline-block;
                width: 100%;
            }
        }
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
            .van-col {
                padding: .2rem 0;
                text-align: center;
            }
        }
        
        .cardWrap{
            flex-wrap:wrap;
            margin-top:.2rem;
            padding: .1rem 0;
            padding: 0.2rem 0.1rem;
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
</style>