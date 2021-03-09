<template>
    <div> 
        <van-nav-bar class="navBar" title="无感支付" left-text="返回" left-arrow @click-left="onClickLeft" />
        <wx-open-launch-weapp
            class="openweapp"
            id="launch-btn"
            username="gh_c001fa831731"
            path="pages/index/index.html"
          >
            <script type="text/wxtag-template">
              <style>.btn { padding: 12px;opacity:0 }</style>
                <button class="btn">打开小程序</button>
            </script>
        </wx-open-launch-weapp>
    </div>
</template>
<script>
export default {
    created(){
        //this.init()
    },
    mounted() {
        var btn = document.getElementById("launch-btn");
        btn.addEventListener("launch", function (e) {
            console.log("success");
        });
        btn.addEventListener("error", function (e) {
            alert("小程序打开失败");
            console.log("fail", e.detail);
        });
    },
    methods:{
        //返回
        onClickLeft(){
            this.$router.go(-1)
        },
        init(){
            wx.config({
                debug: true,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId,         // 必填，公众号的唯一标识，填自己的！
                timestamp: timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
                nonceStr: nonceStr,   // 必填，生成签名的随机串
                signature: signature, // 必填，签名，见附录1
                jsApiList: [
                    'wx-open-launch-weapp',
                ],
                openTagList: ["wx-open-launch-weapp"] // 跳转小程序时必填
            })
            let _this = this
            wx.ready(function (res) {
                console.log(res)
            })
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
                console.log(res)
            });
        }
    }
}
</script>