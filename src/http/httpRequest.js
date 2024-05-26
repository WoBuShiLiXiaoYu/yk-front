import axios from "axios";
import {getTokenName, messagePrompt, messageTitle, removeToken} from "../util/utils";
import ElMessage, {ElMessageBox} from "element-plus";

//axios.defaults.baseURL = "http://localhost:8089"
axios.defaults.baseURL = "http://1.14.72.183:8089"

// get 请求(查询)
function doGet(url, params) {
    return axios({
        method: "get",
        url: url,
        params: params,
        dataType: "json"
    })
}

// post 请求(新增)
function doPost(url, data) {
    return axios ({
        method: "post",
        url: url,
        data: data,
        dataType: "json"
    })
}

// put 请求(修改)
function doPut(url, data) {
    return axios ({
        method: "put",
        url: url,
        data: data,
        dataType: "json"
    })
}

// delete 请求(删除)
function doDelete(url, params) {
    return axios({
        method: "delete",
        url: url,
        params: params,
        dataType: "json"
    })
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 获取 token
    let token = window.sessionStorage.getItem(getTokenName());
    if (!token) {
        token = window.localStorage.getItem(getTokenName());
        if (token) {
            // localStorage 能获取 token，说明选择“记住我”
            config.headers["rememberme"] = true;
        }
    }
    if (token) {
        // 在请求头中添加 token
        config.headers["authorization"] = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code > 40000 && response.data.code < 50000) {
        messagePrompt(response.data.msg + "，是否重新登录？").then(() => {
            removeToken();
                // 跳转到登录页
            window.location.href = "/";
        }).catch(() => {
            messageTitle("取消登录！", "warning")
        })
    }
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export {
    doGet,
    doPost,
    doPut,
    doDelete
}