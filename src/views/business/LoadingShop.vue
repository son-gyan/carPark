<template>
  <div>
  </div>
</template>
<script>
import {GetQueryByString} from '@/utils'
export default {
    created() {
        /* const url=window.location.href;//获取当前地址栏
        const openid=GetQueryByString(url,'openid');//GetQueryByString 自己封装的方法来获取地址栏的参数
        if(!openid){
            this.wxLogin()
        } */
    },
    methods: {
        wxLogin(){
            
            const wxLogin = (appid, url) => {
                let redirect_uri = encodeURIComponent(url)                
                //this.$toast(redirect_uri);
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATUS#wechat_redirect`
            }
            wxLogin('wx653ad587382d8bf5', 'http://gzh.52tingche.com/BlankpageShop')
        }
    }
}
</script>