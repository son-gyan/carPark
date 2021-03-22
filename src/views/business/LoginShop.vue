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
export default {
    data() {
        return {
            form:{                
                username: '',
                password: '',
                openId:'',
                type:1
            }
        };
    },
    created() {
        const url=window.location.href;//获取当前地址栏
        const openid=GetQueryByString(url,'openid');//GetQueryByString 自己封装的方法来获取地址栏的参数
        if(!openid){            
            //this.wxLogin()
        }else{
            this.form.openId = openid
        }
    },
    methods: {
        onSubmit() {
            this.$api.login.login(this.form).then((res) => {
                if(res.code == 200){
                    this.$store.dispatch('setDepId', res.result.merInfo.depId)
                    this.$store.dispatch('setUser', res.result.userInfo)
                    this.$store.dispatch('setMerInfo', res.result.merInfo)
                    sessionStorage.setItem('token',res.result.token)
                    let merInfo = res.result.merInfo
                    sessionStorage.setItem('shopName',merInfo.name)
                    if(merInfo.type == 1){                        
                        this.$router.push('/indexShop')
                    }else if(merInfo.type == 0){
                        this.$router.push('/couponsIndex')
                    }
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
            wxLogin('wx653ad587382d8bf5', 'http://gzh.52tingche.com/BlankpageShop')
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