<template>
    <div class="pages">
        <van-nav-bar class="navBar" title="登录"  />
        <el-form class="formWrap" ref="form" :model="form" label-width="0px">
            <el-form-item>
                <img class="logoImg" src="@/assets/images/logo.png" alt="" srcset="">
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.phone" placeholder="请输入手机号" >
                    <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
                    <template slot="append">
                        <el-button type="success"  @click.prevent="getCaptcha" :disabled="disabled">
                            {{getCode}}
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.code" placeholder="请输入验证码" >
                    <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
                </el-input>
            </el-form-item>
            <!-- <el-form-item class="linkFormItem">
                <el-link class="linkBtn" @click.prevent="regainCode"  :underline="false"   :disabled="disabled">{{regain}}</el-link>
            </el-form-item> -->
            <el-form-item>
                <van-button block type="info"  @click.prevent="onLogin">
                快捷登录
                </van-button>
            </el-form-item>
            <el-form-item style="text-align:center">
                <el-divider>智泊云停车</el-divider>
            </el-form-item>
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
                openId:"",           
                phone: '',
                code:""
            },
            getCode:"获取验证码",
            regain:"重新获取",
            disabled:false,
            time:60
        };
    },
    created(){
        const url=window.location.href;//获取当前地址栏
        const openid=GetQueryByString(url,'openid');//GetQueryByString 自己封装的方法来获取地址栏的参数
        if(openid){
            this.form.openId = openid
        }
    },
    methods: {
        getCaptcha(){
            const reg=/^1[3456789]\d{9}$/;
            if(this.form.phone == ""){
                this.$toast("手机号不能为空");
                return
            }else if(!reg.test(this.form.phone)){
                this.$toast("手机号格式不正确");
                return
            }else{
                let params = {
                    openId:this.form.openId,
                    phone:this.form.phone,
                    appId:config.appID||sessionStorage.getItem('appId')
                }
                let formData = new FormData();
                formData.append('phone',params.phone)
                this.$api.owner.getPhoneCode(formData).then((res) => {
                    if(res.code == 200){
                        this.disabled=true;                        
                        this.getCode = this.time+"秒"
                        //debugger
                        let auth_timer = setInterval(()=>{  //定时器设置每秒递减
                            this.time--;        //递减时间                            
                            this.getCode = this.time+"秒"
                            if(this.time<=0){  
                                this.disabled=false;   //60s时间结束还原v-show状态并清除定时器
                                this.getCode = "获取验证码"
                                this.time = 60
                                clearInterval(auth_timer)
                            }
                        },1000)
                        this.$toast("验证码已发送,请注意查收");
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    console.log(res)
                });
            }
        },
        regainCode(){
            const reg=/^1[3456789]\d{9}$/;
            if(this.form.phone == ""){
                this.$toast("手机号不能为空");
                return
            }else if(!reg.test(this.form.phone)){
                this.$toast("手机号格式不正确");
                return
            }else{
                let params = {
                    openId:this.form.openId,
                    phone:this.form.phone
                }
                let formData = new FormData();
                formData.append('phone',params.phone)
                this.$api.owner.getPhoneCode(formData).then((res) => {
                    //debugger
                    if(res.code == 200){
                        this.disabled=true;
                        this.getCode = this.time+"秒"
                        let auth_timer = setInterval(()=>{  //定时器设置每秒递减
                            this.time--;        //递减时间
                            if(this.time<=0){  
                                this.disabled=false;   //60s时间结束还原v-show状态并清除定时器
                                this.getCode = "重新获取"
                                clearInterval(auth_timer)
                            }
                        },1000)
                        this.$toast("验证码已发送,请注意查收");
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    console.log(res)
                });
            }
        },
        onLogin() {
            const reg=/^1[3456789]\d{9}$/;
            if(this.form.phone == ""){
                this.$toast("手机号不能为空");
                return
            }else if(!reg.test(this.form.phone)){
                this.$toast("手机号格式不正确");
                return
            }else{
                let params = {
                    appId:config.appID||sessionStorage.getItem('appId'),
                    openId:this.form.openId,
                    phone:this.form.phone,
                    code:this.form.code
                }
                let formData = new FormData();
                formData.append('openId',params.openId)
                formData.append('phone',params.phone)
                formData.append('code',params.code)
                formData.append('appId',params.appId)
                this.$api.owner.register(formData).then((res) => {
                    if(res.code == 200){
                        sessionStorage.setItem('token',res.result.token)
                        if(res.result.userInfo){                            
                            sessionStorage.setItem('userId',res.result.userInfo.id)
                            this.$store.dispatch('setUser', res.result.userInfo)
                        }
                        if(res.result.vipUser){
                            this.$store.dispatch('setVipUser', res.result.vipUser)
                            sessionStorage.setItem('vipMoney',res.result.vipUser.money)
                        }
                        this.$router.push('/indexOwner')
                    }else{
                        this.$toast(res.message);
                    }
                }).catch((res) => {
                    console.log(res)
                });
            }
        }
            
    }
}
</script>
<style lang="scss" scoped>
    .logoImg{
        width: 100%;
    }
    .formWrap{
        height: calc(100% - 46px);
        padding: 1.5rem 0.5rem 0;
        background: #fff;
        box-sizing: border-box;
        .center{
            text-align: center;
        }
        .wxIcon{
            width:60px ;
            height:60px;
            padding: 0;
            //background: url('../assets/images/wxIcon.png') center;
            background-size: cover;
            border-radius: .2rem;
        }
        .linkFormItem{
            text-align: right;
        }
        .linkBtn{
            align-self: flex-end;
        }
        /deep/ .el-divider__text{
            font-size: .4rem;
        }
        /deep/ .el-input-group__append{
            color: #FFF;
            background-color: #1989fa;
            border-color: #1989fa;
        }
        .el-button--success.is-disabled{
            color: #FFF;
            background-color: #1989fa;
            border-color: #1989fa;
        }
    }
</style>