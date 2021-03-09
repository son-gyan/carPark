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
                    <van-grid-item  text="预约车场" @click='jumpTo(7)' to="" />
                </van-grid>
                <!-- <van-button  type="info"  @click.prevent="jumpTo(7)">
                预约车场
                </van-button> -->
            </el-main>
        </el-container>
    </div>
</template>
<script>
import config from "@/api/config";
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
        jumpTo(type){
            switch (type) {
                case 1:
                    this.$router.push('/deviceManage')
                    break;
                case 2:
                    this.$router.push('/carManage')
                    break;
                case 3:
                    this.$router.push('/presentCar')
                    break;
                case 4:
                    this.$router.push('/detentionInventory')
                    break;
                case 5:
                    this.$router.push('/blacklist')
                    break;
                case 6:
                    this.$router.push('/statistical')
                    break;                
                case 7:
                    this.$router.push('/orderShop')
                    break;                
                default:
                    break;
            }

        },
        logout(){
            sessionStorage.clear();
            this.$router.push({
                path:"/login",
                query:{
                    openid:this.user.openid,
                    appId:config.appID
                }
            })
            /* window.location.replace(
                window.location.origin + "/loginShop?openid="+this.user.openid
            ); */
        }
    },
    beforeRouteEnter  (to, from, next) {
        next(vm => {
            if (from.name === 'login') {
                vm.projectLst = []
                vm.getProject()
            }
        })
    },
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