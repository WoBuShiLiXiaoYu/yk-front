<template>
  <div class="box">
    <div class="title">
      欢迎使用云客管理系统
    </div>
    <div class="loginDiv">
      <el-container>
        <!-- 左侧 -->
        <el-aside width="500px">
          <img src="../assets/loginBox.svg">
        </el-aside>
        <!-- 右侧 -->
        <el-main style="margin-top: 50px">
          <div style="text-align: center; margin-bottom: 25px; color: black; font-size: 20px; font-family: 'SimHei'; font-weight: bold">登录云客系统</div>
          <el-form :model="user" label-width="auto" style="max-width: 600px" :rules="loginRules" ref="loginFormRef" @keyup.native.enter="entLogin()">
            <el-form-item label="账号" prop="loginAct">
              <el-input v-model="user.loginAct" />
            </el-form-item>
            <el-form-item label="密码" prop="loginPwd">
              <el-input type="password" v-model="user.loginPwd" />
            </el-form-item>
            <el-form-item>
              <el-checkbox style="margin-left: 60px" label="记住我" v-model="user.rememberMe"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login()" style="width: 70%; margin-left: 60px">登 录</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import {doGet, doPost} from "../http/httpRequest";
import {getTokenName, messageTitle, removeToken} from "../util/utils";

export default {
  name: "LoginView",
  data() {
    return {
      // 用户
      user : {
        loginAct : '',
        loginPwd : '',
        rememberMe: ''
      },
      // 校验规则
      loginRules : {
        loginAct: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
        ],
        loginPwd: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.freeLogin();
  },

  methods: {
    // 登录
    login() {
      // 登录前进行表单验证
      this.$refs.loginFormRef.validate((isValid) => {
        if (isValid) {
          // 提交
          let formData = new FormData();
          formData.append("loginAct", this.user.loginAct);
          formData.append("loginPwd", this.user.loginPwd);
          formData.append("rememberMe", this.user.rememberMe);
          doPost("/api/user/login", formData).then((resp) => {
            if(resp.data.code === 0) {
              // 登录成功
              messageTitle("登录成功！", "success");
              // 删除原来存储的 token
              removeToken();
              if(this.user.rememberMe === true) {
                window.localStorage.setItem(getTokenName(), resp.data.data);
              }
              else {
                window.sessionStorage.setItem(getTokenName(), resp.data.data);
              }
              // 跳转
              window.location.href = "/dashboard";
            } else {
              // 登录失败
              messageTitle("登录失败！", "error");
            }
          });
        }
      })
    },

    // 回车登录
    entLogin() {
      if (event.keyCode === 13 || event.keyCode === 100) {
        this.login();
      }
    },

    //免登录
    freeLogin() {
      // 如果用户上一次选择”记住我“，则 localStorage 中存有 token
      let token = window.localStorage.getItem(getTokenName());
      if (token) {
        // 发送验证请求
        doGet("/api/user/login/free", null).then(resp => {
          if (resp.data.code === 0) {
            // 验证通过，跳转页面
            window.location.href = "/dashboard";
          } else {
            messageTitle("登录过期！请重新登录！", "warning");
          }
        })
      }
    }
  }


}
</script>

<style scoped>
  .box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("../assets/loginBackground.jpg");
    background-size: cover;
  }
  .title {
    color: white;
    font-size: 50px;
    font-family: "YouYuan";
    font-weight: bold;
    text-align: center;
    position: fixed;
    top: 100px;
  }
  .loginDiv {
    background-color: white;
    width: 950px;
    height: 400px;
  }
  img {
    height: 40vh;
  }
  el-form {
    width: 60%;
    margin: auto;
  }
  
</style>