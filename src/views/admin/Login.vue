<template>
    <div class="pages">
        <el-form class="formWrap" ref="form" :model="form" label-width="80px">
            <el-form-item label="账号：">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <van-button block type="info"  @click.prevent="onSubmit">
                登录
                </van-button>
            </el-form-item>
            <!-- <el-form-item style="text-align:center">
                <el-button type="success" class="wxIcon" @click.prevent="wxLogin">
                </el-button>
            </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
import {GetQueryByString} from '@/utils'
import config from "@/api/config";
export default {
    data() {
        return {
            form:{                
                username: '',
                password: '',
                openId:'',
                type:0,
                appId:config.appID||sessionStorage.getItem('appId')
            }
        };
    },
    created() {
        /* const url=window.location.href;//获取当前地址栏
        const openid=GetQueryByString(url,'openid');//GetQueryByString 自己封装的方法来获取地址栏的参数
        console.log(config.appID||sessionStorage.getItem('appId'),'appID4') */
        const openid = this.$route.query.openid
        if(!openid){            
            //this.wxLogin()
        }else{
            this.form.openId = openid
            this.form.appId = this.$route.query.appId
            console.log(config.appID||sessionStorage.getItem('appId'),'appID5')
        }
    },
    methods: {
        onSubmit() {
            this.$api.login.login(this.form).then((res) => {
                if(res.code == 200){
                    this.$store.dispatch('setUser', res.result.userInfo)
                    this.$store.dispatch('setOrgCategory', res.result.park.orgCategory)
                    sessionStorage.setItem('token',res.result.token)
                    
                    if(res.result.depart){                        
                        sessionStorage.setItem('departName',res.result.depart.departName)
                        this.$store.dispatch('setDepartInfo', res.result.depart)
                    }
                    this.$router.push('/index')
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        wxLogin(){            
            const wxLogin = (appid, url) => {
                let redirect_uri = encodeURIComponent(url)                
                //this.$toast(redirect_uri);
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATUS#wechat_redirect`
            }
            wxLogin('wx653ad587382d8bf5', 'http://gzh.52tingche.com/Blankpage')
        }
            
    }
}
</script>
<style lang="scss" scoped>
    .formWrap{
        height:100%;
        padding:4.5rem 0.5rem;
        background: #eee;
        box-sizing: border-box;
        .wxIcon{
            width:60px ;
            height:60px;
            padding: 0;
            //background: url('../assets/images/wxIcon.png') center;
            background-size: cover;
            border-radius: .2rem;
        }
    }
</style>