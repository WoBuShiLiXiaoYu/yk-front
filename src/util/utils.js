import {ElMessage, ElMessageBox} from "element-plus";


function messageTitle(msg, type) {
    ElMessage({
        // 是否显示关闭按钮
        showClose: true,
        // 消息文字
        message: msg,
        // 消息类型
        type: type,
        // 显示时间
        duration: 3000,
        center: true
    })
}

function getTokenName() {
    return "yk_token";
}

function removeToken() {
    window.sessionStorage.removeItem(getTokenName());
    window.localStorage.removeItem(getTokenName());
}

function messagePrompt(msg) {
    return ElMessageBox.confirm(
        // 提示
        msg,
        '系统提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}

function getToken() {
    let token = window.sessionStorage.getItem(getTokenName());
    if (!token) {
        token = window.localStorage.getItem(getTokenName());
    }
    if (token) {
        return token;
    } else {
        messagePrompt("token 已过期！是否重新登录？").then(() => {
            removeToken();
            // 跳转到登录页
            window.location.href = "/";
        }).catch(() => {
            messageTitle("取消登录！", "warning")
        })
    }
}

export {
    messageTitle,
    getTokenName,
    removeToken,
    messagePrompt,
    getToken
}