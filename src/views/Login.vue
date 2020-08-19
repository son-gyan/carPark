<template>
    <div class="pages">
        <el-form class="formWrap" ref="form" :model="form" label-width="80px">
            <el-form-item label="账号：">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
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
            console.log('submit');
            this.$router.push('/index')
        },
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