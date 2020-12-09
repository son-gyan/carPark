/* let flag = false
let baseUrl = "",
    pageUrl = "",
    appID = "";
if(flag){
    baseUrl = "http://52tingche.com"
    pageUrl = "http://gzh.52tingche.com"
    appID = "wx653ad587382d8bf5"
}else{
    baseUrl = "http://beta.52tingche.com" 
    pageUrl = "http://gzh1.52tingche.com"
    appID = "wx09a13be6962ab9a8"
} */

export default {
    method: 'get',
    // 基础url前缀
    baseUrl: baseUrl,
    pageUrl:pageUrl,
    appID:appID,
    // 请求头信息
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Credentials':true
    },
    // 参数
    data: {},
    // 设置超时时间
    timeout: 100000,
    // 携带凭证
    withCredentials: true,
    // 返回数据类型
    responseType: 'json'
}