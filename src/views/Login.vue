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
            <el-form-item>
                <van-button block type="info"  @click.prevent="wxLogin">
                   微信登录
                </van-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form:{                
                username: '',
                password: '',
            }
        };
    },
    methods: {
        onSubmit() {
            this.$api.login.login(this.form).then((res) => {
                if(res.code == 200){
                    this.$store.dispatch('setUser', res.result.userInfo)
                    this.$store.dispatch('setOrgCategory', res.result.park.orgCategory)
                    sessionStorage.setItem('token',res.result.token)
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
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATUS#wechat_redirect`
            }
            wxLogin('wx546563fe38304393', 'http://whc.mouhua.cn/mobile/blankpage')
        }
            
    }
}
</script>
<style lang="scss" scoped>
    .formWrap{
        height:100%;
        padding:4.5rem 0.5rem;
        background: #eee;
    }
</style>