<template>
  <div>
  </div>
</template>
<script>
import {GetQueryByString} from '@/utils'
import axios from "axios";
import config from "@/api/config";
export default {
    created(){
        this.initDataFn();
    },
    methods: {
        initDataFn() {
            try {
                const url=window.location.href;//获取当前地址栏
                const aid=GetQueryByString(url,'aid');//GetQueryByString 自己封装的方法来获取地址栏的参数
                let start=url.indexOf("code");
                const code=url.substr(start+5,32);
                
                //alert(url)
                const appIdVal2 = config.appID
                sessionStorage.setItem('appId',JSON.parse(JSON.stringify(appIdVal2)))
                if (start>=0){//如果存在code  , type:0
                    let formData = new FormData();
                        formData.append('code',code)
                        formData.append('type',0)
                        formData.append('appId',config.appID)
                    this.$api.login.wxlogin(formData)  //code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
                        .then(res => {
                            console.log(res,"blankpageRes")
                            if(res.code == 200){
                                this.$store.dispatch('setUser', res.result.userInfo)
                                this.$store.dispatch('setOrgCategory', res.result.park.orgCategory)
                                sessionStorage.setItem('token',res.result.token)
                                if(res.result.depart){                        
                                    sessionStorage.setItem('departName',res.result.depart.departName)
                                    this.$store.dispatch('setDepartInfo', res.result.depart)
                                }
                                this.$router.push('/index')
                            }else if(res.code == 201){
                                /* window.location.replace(
                                    window.location.origin + "/login?openid="+res.message
                                ); */
                                this.$router.push({
                                    path:"/login",
                                    query:{
                                        openid:res.message,
                                        appId:config.appID
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            
                        });
                }
            } catch (err) {

            }
        }

    },
}
</script>