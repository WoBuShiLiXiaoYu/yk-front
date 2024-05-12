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
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}

export {
    messageTitle,
    getTokenName,
    removeToken,
    messagePrompt
}