<template>
    <div class="pages">
        <el-form class="formWrap" ref="form" :model="form" label-width="0px">
            <el-form-item>
                <h3 class="center">快捷登录</h3>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <van-button block type="info"  @click.prevent="onNext">
                下一步
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
                phone: ''
            }
        };
    },
    methods: {
        onNext() {
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
    .formWrap{
        height:100%;
        padding:4.5rem 0.5rem;
        background: #eee;
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
    }
</style>