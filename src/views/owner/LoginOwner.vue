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
                        <el-button type="success"  @click.prevent="getCaptcha">
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
            <el-form-item class="linkFormItem">
                <el-link class="linkBtn" @click.prevent="regainCode"  :underline="false">{{regain}}</el-link>
            </el-form-item>
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
export default {
    data() {
        return {
            form:{                
                phone: '',
                code:""
            },
            getCode:"获取验证码",
            regain:"重新获取"
        };
    },
    methods: {
        getCaptcha(){

        },
        regainCode(){

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
                this.$router.push('/indexOwner')
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
            font-size: 20px;
        }
    }
</style>