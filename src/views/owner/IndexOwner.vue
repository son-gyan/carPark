<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="首页"  >
            <template #right>
                <span class="span">{{user.username}}</span>
                <span class="span" @click="logout" style="margin-left:10px;">切换账号</span>
            </template>
        </van-nav-bar>
        <el-container class="elContainer" v-loading="loading">
            <!-- <el-main class="elMainShop"> -->
            <el-main class="">
                <van-grid :gutter="5" :column-num="2">
                    <van-grid-item  text="车主主页"  to="" />
                </van-grid>
                <!-- <van-button  type="info"  @click.prevent="jumpTo(7)">
                预约车场
                </van-button> -->
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            loading:false,
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        logout(){
            sessionStorage.clear();
            window.location.replace(
                window.location.origin + "/loginOwner?openid="+this.user.openid
            );
        }
    }
}
</script>
<style lang="scss" >
    .pages{

        .el-header{
            height:auto !important;
            padding: 0;            
            padding-top:0.5rem;
            border-bottom: 1px solid #eee;
        }
        .elContainer{
            height:100%;
        }
        .elMainShop{
            display: flex;
            height:100%;
            align-items: center;
            justify-content: center;
            padding:0;
        }
        
        .navBar{
            .span{
                color:#fff;
            }
        }
    }
</style>
<style lang="scss" scoped>
.pages{
    .navBar{
       /deep/ .van-ellipsis{
           margin-left: 1rem;
        }
        
    }
    .van-grid{
        /*margin-top:.5rem;
            box-shadow: 0 2px 11px rgba(0,0,0,.6); */
    }
    /deep/ .van-grid-item__content--center{
        height:2.8rem;
        background-color: #1989fa;
        color:#fff;
        .van-grid-item__text{
            color:#fff;
            font-size: .3rem;
            font-weight: bold;
        }
    }
}
</style>