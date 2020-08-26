<template>
    <div>
        <van-nav-bar class="navBar" title="滞留盘点" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <van-card
                    v-for="(item,index) in retentionList"  :key="index"
                    :thumb="item.imgUrl"
                    @click-thumb="imgPreview(item.imgUrl)"
                    >
                    <template #title>
                        <p v-if="item.carType==1">月租车</p> 
                        <p v-if="item.carType==2">储值车</p> 
                        <p v-if="item.carType==3">免费车</p> 
                        <p v-if="item.carType==4">临时车</p> 
                        <p v-if="item.carType==5">时段限制月租</p> 
                    </template>
                    <template #desc>
                        <p >车牌：{{item.carNum}}</p>
                        
                        <p >入场：{{item.inTime}}</p>
                    </template>
                    <template #footer>
                        <van-button type="info" size="mini" @click="confirmHandle(item.id)">确 认</van-button>
                        <van-button type="info" size="mini" @click="delHandle(item.id)">删 除</van-button>
                    </template>
                </van-card>
                <div class="noSearch" v-if="retentionList.length === 0">暂无查询数据</div>
            </van-list>    
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { ImagePreview } from 'vant';
export default {
    components: {
        [ImagePreview.name]: ImagePreview
    },
    data(){
        return {
            finished: false,
            loading: false,
            retentionList:[],
            params:{
                depId:'',
                pageNo:1,
                pageSize:10 
            },
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
        // 下拉加载
        onLoad () {
            if (!this.loading) {
                return false
            }
        },
        //数据初始化
        initData(){
            console.log(this.params,'params')
            this.$api.home.getRetentionList(this.params).then(res=>{
                if(res.code == 200){
                    this.finished = true
                    this.retentionList = res.result.records
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //预览
        imgPreview(url){
            ImagePreview({
                images: [url],
                showIndex:false,
                closeable: true,
            });
        },
        //确认
        confirmHandle(id){
            /* let formData = new FormData();
            formData.append('id',id) */
            let formData = {
                id:id
            }
            this.$api.home.checkRetention(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
                    this.initData()
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        //删除
        delHandle(id){
            /* let formData = new FormData();
            formData.append('id',id) */
            let formData = {
                id:id
            }
            this.$api.home.delRetention(formData).then(res=>{
                if(res.code == 200){
                    this.$toast(res.message);
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
        .van-list{            
            padding-top:.2rem;
        }
        .van-card{
            p{
                font-size: .3rem;
            }
        }
    }
</style>