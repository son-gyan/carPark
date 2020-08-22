<template>
    <div>
        <van-nav-bar title="设备管理" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="mainWrap">
            <van-list
                :finished="finished"
                v-model="loading"
                finished-text="没有更多了"
                @load="onLoad"
                style="margin-top: 46px;margin-bottom: 50px;"
                >
                <div class="title">车场名称：{{'宜昌夷陵A场'}}</div>
                <van-row type="flex" justify="center" align="center">
                    <van-col span="8">类型</van-col>
                    <van-col span="8">在线状态</van-col>
                    <van-col span="8">心跳时间</van-col>
                </van-row>
            </van-list>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            finished: false,
            loading: false,
        }
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
    }
}
</script>
<style lang="less" scoped>
    .mainWrap{
        .title{
            text-align: center;
        }
        .van-col {
            background-color: #39a9ed;
        }
    }
</style>