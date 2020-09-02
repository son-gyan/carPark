<template>
  <div>
  </div>
</template>
<script>
import {GetQueryByString} from '@/utils'
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
                if (start>=0){//如果存在code
                    weixinlogin(code,this.fromId)  //code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
                        .then(res => {
                            fundebug.notify('微信登录信息',JSON.stringify(res))
                            this.setInitData()
                                .then(() => {
                                    window.location.replace(
                                        window.location.origin + window.location.pathname + "#/?aid="+aid//授权成功返回的页面
                                    );
                                })
                                .catch(err => {
                                });
                        })
                        .catch(err => {
                            window.location.replace(
                                window.location.origin + window.location.pathname + "#/login?aid="+aid
                            );
                        });
                }
            } catch (err) {

            }
        }

    },
}
</script>