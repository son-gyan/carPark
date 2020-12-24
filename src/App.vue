<template>
    <div id="app">
        <keep-alive>
            <router-view class="child-view" v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view class="child-view" v-if="!$route.meta.keepAlive"/>
    </div>
</template>

<script>
export default {
    name: 'App',
    created () { 
        //在页面加载时读取sessionStorage里的状态信息 
        if (sessionStorage.getItem("store") ) { 
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        } 
        //在页面刷新时将vuex里的信息保存到sessionStorage里 
        window.addEventListener("beforeunload",()=>{ 
            sessionStorage.setItem("store",JSON.stringify(this.$store.state)) 
        }) 

        if(flag == 'localhost'){
            //debugger
            this.wxLogin()
        }
    },
    methods: {
        wxLogin(){
            let userInfoTest = {
              createBy: null,
              createTime: "2020-12-15 20:58:04",
              delFlag: "0",
              depId: null,
              departName: null,
              id: "1338830684261158913",
              lastLoginTime: null,
              memo: null,
              merId: "0",
              openid: "oJ9ce6AReY92_NKr7fGyBKoAwNUU",
              phone: "18602701015",
              realname: null,
              roleId: null,
              roleName: null,
              status: 1,
              type: 2,
              updateBy: null,
              updateTime: null,
              username: "18602701015"
            },
            tokenTest = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDg4MjMwOTksInVzZXJuYW1lIjoib0o5Y2U2QVJlWTkyX05LcjdmR3lCS29Bd05VVSJ9.ymxJFqmYdr0Ai28fT_4D7HQMaFD6rw-jIMZLiHIohaQ";
            this.$store.dispatch('setUser', userInfoTest)                           
            sessionStorage.setItem('userId',userInfoTest.id)
            sessionStorage.setItem('token',tokenTest)
            this.$router.push('/indexOwner')
        }
    }
}
</script>

<style lang="scss">
html,body {
    width: 100%;
    height: 100%;
}
*{
    margin:0;
    padding: 0;
}
#app {
    width: 100%;
    height:100%;
    background: #f2f2f2;
    .child-view{
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .whiteBg{
        height:100%; 
        background: #fff;
    }
    .pages{
        height:100%; 
        background: #f2f2f2;
    }
    .van-nav-bar__text{
        color:#fff
    }
    .vanList{
        margin-top:46px;
    }
}
</style>
