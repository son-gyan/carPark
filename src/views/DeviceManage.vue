<template>
    <div>
        <van-nav-bar class="navBar" title="设备管理" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <div class="title">车场名称：{{carParkInfo.name}}</div>
                <van-row type="flex" justify="center" class="cardHeaderWrap" >
                    <van-col span="8">类型</van-col>
                    <van-col span="8">在线状态</van-col>
                    <van-col span="8">心跳时间</van-col>
                </van-row>
                <div class="list" v-for="(item,index) in deviceList" :key='index'>
                    <van-row  class="cardWrap" type="flex" justify="center" align="center" @click='changeState(index)'>
                        <van-col span="8">{{item.laneName}}</van-col>
                        <van-col span="8" class="red" v-if='item.onlineStatus==2'>离线</van-col>
                        <van-col span="8" class="green" v-if='item.onlineStatus==1'>在线</van-col>
                        <van-col span="8">{{item.heartBeatTime}}</van-col>
                        <template class="btnGroup" v-if='isShow[index]'>                        
                            <van-divider  class="divider"/>
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
            isShow:[]
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
        },
        //数据初始化
        initData(){
            let params = {
                depId:this.carParkInfo.depId,
                pageNo:1,
                pageSize:10
            }
            this.$api.home.getDeviceList(params).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.deviceList = res.result.records
                    this.deviceList.map(o=>this.isShow.push(false))
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
    }
</style>