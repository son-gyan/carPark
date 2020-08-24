import axios from "axios";
import config from "./config";
import router from "@/router";
import store from '@/store'
export default function $axios(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: config.baseUrl,
            headers: config.headers,
            timeout: config.timeout,
            withCredentials: false,//config.withCredentials
        });

        // request 拦截器
        instance.interceptors.request.use(
            config => {
                let token = sessionStorage.getItem("token");
                if (token) {                    
                    config.headers = {
                        "X-Access-Token":token,
                        'Content-Type':options.headers?options.headers['Content-Type']:config.headers['Content-Type']
                    };
                } else {
                    // 重定向到登录页面
                    router.push("/login");
                }
                // 时间戳
                if (config.method === 'post') {
                    if(config.headers['Content-Type'] == "multipart/form-data;charset=utf-8"){
                       
                    }else{
                        config.data = {
                            ...config.data,
                            t: Date.parse(new Date()) / 1000
                        }
                    }                    
                } else if (config.method === 'get') {
                    config.params = {
                        t: Date.parse(new Date()) / 1000,
                        ...config.params
                    }
                }
                return config;
            }
        )
        
        // response 拦截器
        instance.interceptors.response.use(
            response => {
                let data
                // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
                if (response.data == undefined) {
                    data = JSON.parse(response.request.responseText);
                } else {
                    data = response.data;                    
                    //data = response;
                }
                return data;
            },
            err => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            err.message = "请求错误";
                            break;
                        case 401:
                            err.message = "请求错误";
                            break;
                        case 403:
                            err.message = "拒绝访问";
                            break;
                        case 404:
                            err.message = `请求地址出错: ${err.response.config.url}`;
                            break;
                        case 408:
                            err.message = "请求超时";
                            break;
                        case 500:
                            debugger
                            err.message = "服务器内部错误";
                            break;
                        case 501:
                            err.message = "服务未实现";
                            break;
                        case 502:
                            err.message = "网关错误";
                            break;
                        case 503:
                            err.message = "服务不可用";
                            break;
                        case 504:
                            err.message = "网关超时";
                            break;
                        case 505:
                            err.message = "HTTP版本不受支持";
                            break;
                    }
                }else if(err.message !=""){
                    // 重定向到登录页面
                    router.push("/login");
                }
                return Promise.reject(err); // 返回接口返回的错误信息
            }
        )
        // 请求处理
        instance(options)
        .then(res => {
            if(res){              
              resolve(res);
            }
            return false;
        })
        .catch(error => {
            reject(error);
        }); 
    })
}