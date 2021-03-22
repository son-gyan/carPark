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
                //alert(code)
                if (start>=0){//如果存在code
                    let formData = new FormData();
                        formData.append('code',code)
                        formData.append('type',1)
                        formData.append('appId',config.appID)
                    this.$api.login.wxlogin(formData)  //code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
                        .then(res => {
                            if(res.code == 200){
                                this.$store.dispatch('setDepId', res.result.merInfo.depId)
                                this.$store.dispatch('setUser', res.result.userInfo)
                                this.$store.dispatch('setMerInfo', res.result.merInfo)
                                sessionStorage.setItem('token',res.result.token)
                                let merInfo = res.result.merInfo
                                sessionStorage.setItem('shopName',merInfo.name)
                                if(merInfo.type == 1){ 
                                    /* window.location.replace(
                                        window.location.origin +"/indexShop"  //授权成功返回的页面
                                    ); */
                                    this.$router.push('/indexShop')
                                }else if(merInfo.type == 0){
                                    /* window.location.replace(
                                        window.location.origin +"/couponsIndex"  //授权成功返回的页面
                                    ); */
                                    this.$router.push('/couponsIndex')
                                }
                            }else if(res.code == 201){
                                /* window.location.replace(
                                    window.location.origin + "/loginShop?openid="+res.message
                                ); */
                                this.$router.push({
                                    path:"/loginShop",
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