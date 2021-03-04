<template>
    <div>
        <van-nav-bar class="navBar" title="项目绑定" left-text="返回" left-arrow @click-left="onClickLeft" fixed/>
        <div class="mainWrap fixedMain">
            <van-row type="flex" class="topBtnGroup">
                <van-col span="24">
                    <van-button type="info" size="small" @click="save">保存</van-button>
                </van-col>
            </van-row>
            <div class="vanCard">
                <van-row class="projectHead" type="flex" justify="center" align="center">
                    <van-col span="12">分公司</van-col>
                    <van-col span="12">项目</van-col>
                </van-row>
                <van-row class="projectContent" type="flex" justify="center" align="center">
                    <van-col span="12">
                        <van-checkbox-group v-model="companyArray"  @change="handleChangeCompany">
                            <van-checkbox :name="item.id" v-for="(item,index) in companyList" :key="index">
                                {{item.departName}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </van-col>
                    <van-col span="12">
                        <van-checkbox-group v-model="projectArray" @change="handleChangeProject">
                            <van-checkbox  :name="item.id" v-for="(item,index) in projectList" :key="index">
                                {{item.departName}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </van-col>
                </van-row>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            loading:false,
            params:{
                depId:'' 
            },
            companyArray:[],
            projectArray:[],
            totalProject:[],
            companyList:[],
            projectList:[],
            parentId:"",
            pId:""
        }
    },
    computed: {
        ...mapGetters(['departInfo'])
    },
    watch: {
        parentId(val) {
            this.projectList = []
            this.projectArray=[]
            this.totalProject.map((item,j)=>{
                if(item.parentId==val){
                    this.projectList.push(item)
                    this.projectArray.push(item.id)
                }
            })
        },
        /* pId(val){
            //debugger
            this.projectArray=[]
            this.totalProject.map((item,j)=>{
                if(item.parentId==val){
                    this.projectArray.push(item.id)
                }
            })
        }, */
        /* projectArray(val){
            //debugger
            this.totalProject.map((item,j)=>{
                if(item.id==val){
                    this.companyArray.push(item.parentId)
                }
            })
            
        } */
    },
    created() {
        this.params.depId = this.departInfo.id
        this.init()
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            this.$api.home.getBindlist(this.params).then(res=>{
                if(res.code == 200){
                    this.loading = false
                    this.companyList = res.result.gs
                    this.totalProject = res.result.xm
                    this.parentId = this.companyList[0].id
                    this.pId = this.companyList[0].id
                    this.companyArray.push(this.companyList[0].id)
                    //debugger
                }else{
                    this.$toast(res.message);
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        handleChangeCompany(val){
            if(val.length==0){
                this.projectArray=[]
            }
            this.companyArray.map((item,i)=>{
                this.totalProject.map((o,j)=>{
                    if(item=o.id){
                        this.projectArray.push(o.id)
                    }
                })
            })
            console.log(this.companyArray,"companyArray");
            console.log(this.projectArray,"projectArray");
        },
        handleChangeProject(val){
            //debugger
            console.log(this.companyArray,"companyArray");
            console.log(this.projectArray,"projectArray");
        },
        save(){
            let bindIds = this.companyArray.join(',')+this.projectArray.join(',')
            let noBindIds = ""
            let param = {
                bindIds:bindIds,
                depId:this.params.depId
            }
            let formdata = new FormData()
                formdata.append('bindIds',bindIds)
                formdata.append('depId',this.params.depId)
            this.$api.home.saveBindData(formdata).then(res=>{
                if(res.code == 200){
                    //debugger
                    this.$toast(res.message);
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
<style lang="less" scoped>
    .vanCard{
        font-size: 0.3rem;
       .projectHead{
           height:.8rem;
           text-align: center;
           border-bottom: 1px solid #999;
        } 
        .projectContent{
            margin:.3rem 0.1rem;
            padding-bottom: .3rem;
            /deep/ .van-col:first-child{
                border-right:1px solid #999;
            }
        }
        /deep/ .van-checkbox{
            margin-bottom: .1rem;
        }
        .van-checkbox-group{
            margin-left:0.1rem;
        }
    }
    
</style>