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
    methods: {
        onSubmit() {
            this.$api.login.login(this.form).then((res) => {
                if(res.code == 200){
                    this.$store.dispatch('setDepId', res.result.merInfo.depId)
                    this.$store.dispatch('setUser', res.result.userInfo)
                    //this.$store.dispatch('setOrgCategory', res.result.park.orgCategory)
                    sessionStorage.setItem('token',res.result.token)
                    this.$router.push('/indexOwner')
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
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