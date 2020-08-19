<template>
    <div class="pages">
        <el-container>
            <el-header>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="当前项目：">
                        <el-select v-model="form.curProject" placeholder="请选择当前项目">
                            <el-option label="宜昌项目1" value="1"></el-option>
                            <el-option label="宜昌项目2" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车场切换：">
                        <el-select v-model="form.carPark" placeholder="请选择车场">
                            <el-option label="宜昌夷陵广场车场" value="1"></el-option>
                            <el-option label="三峡机场车场A" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main>
                <van-grid :gutter="10" :column-num="2">
                    <van-grid-item icon="photo-o" text="设备管理" to="/" />
                    <van-grid-item icon="photo-o" text="车辆管理" to="/" />
                    <van-grid-item icon="photo-o" text="在场车辆" to="/" />
                    <van-grid-item icon="photo-o" text="滞留盘点" to="/" />
                    <van-grid-item icon="photo-o" text="黑名单" to="/" />
                    <van-grid-item icon="photo-o" text="统计报表" to="/" />
                </van-grid>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: { //form表单
                curProject:'1',
                carPark:'1'
            }
        }
    }
}
</script>
<style lang="scss">
    .pages{
        .el-header{
            height:auto !important;
            padding: 0;            
            padding-top:0.5rem;
            border-bottom: 1px solid #eee;
        }
        .van-grid-item__content--center{
            background-color: #169bd5;
            color:#fff;
            .van-grid-item__text{
                color:#fff;
            }
        }
    }
</style>