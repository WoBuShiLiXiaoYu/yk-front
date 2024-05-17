<template>


  <el-container>
    <!--左侧-->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          style="border-right: solid 0px"
          :unique-opened="true"
          :collapse="isCollapse"
          :router="true"
          :collapse-transition="false">

        <div class="menuTitle" v-if="!isCollapse">@云·客管理系统</div>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>市场活动</span>
          </template>
            <el-menu-item index="/dashboard/activity">
              <el-icon><School /></el-icon>
              市场活动</el-menu-item>
            <el-menu-item index="1-2">
              <el-icon><Histogram /></el-icon>
              市场统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>线索管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><Document /></el-icon>
            线索管理</el-menu-item>
          <el-menu-item index="1-2">
            <el-icon><Histogram /></el-icon>
            线索统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><Document /></el-icon>
            客户管理</el-menu-item>
          <el-menu-item index="1-2">
            <el-icon><Histogram /></el-icon>
            客户统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>交易管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><PriceTag /></el-icon>
            交易管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5">
          <template #title>
            <el-icon><Orange /></el-icon>
            <span>产品管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><PriceTag /></el-icon>
            产品管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>字典管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><PriceTag /></el-icon>
            字典管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="7">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/dashboard/user">
            <el-icon><PriceTag /></el-icon>
            用户管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="8">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><Platform /></el-icon>
            系统管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!--右侧-->
    <el-container class="rightContext">
      <!--右侧：上-->
      <el-header>
        <el-icon class="show" @click="showMenu()" v-if="isCollapse"><Expand /></el-icon>
        <el-icon class="show" @click="showMenu()" v-else><Fold /></el-icon>

        <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          {{ user.name }}<el-icon class="el-icon--right"><arrow-down/></el-icon>
        </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>我的资料</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!--右侧：中-->
      <el-main>
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
      <!--右侧：下-->
      <el-footer><a href="javascript:void(0);" style="font-size: small; color: #888888">@版权所有 2024 攀枝花市东区</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="javascript:void(0);" style="font-size: small; color: #888888"><img src="../assets/bei.png" >京公网安备 11451400000号</a></el-footer>
    </el-container>
  </el-container>
</template>

<script>
import {doGet} from "../http/httpRequest";
import {messagePrompt, messageTitle, removeToken} from "../util/utils";

export default {
  name: "DashboardView",
  data() {
    return {
      // 控制左侧菜单展示、折叠
      isCollapse : false,
      // 登录用户
      user : {},
      // 控制页面显示
      isRouterAlive: true

    }
  },
  mounted() {
    // vue 开始加载用户信息
    this.loadLoginUser();
  },

  // 提供
  provide() {
    return {
      reload: () => {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      }
    }
  },

  methods: {
    // 左侧菜单展示、折叠
    showMenu() {
      this.isCollapse = !this.isCollapse;
    },

    // 加载当前登录用户
    loadLoginUser() {
      doGet("/api/user/login/info", null).then(resp => {
        this.user = resp.data.data.user;
      })
    },

    // 退出登录
    logout() {
      doGet("/api/user/logout", null).then(resp => {
        if (resp.data.code === 0) {
          // 正常退出成功，删除 token，跳转登录页面
          removeToken();
          messageTitle("退出成功！", "success");
          window.location.href = "/";
        } else {
          // 退出异常，强制退出
          messagePrompt("退出异常！是否强制退出？").then(() => {
            removeToken();
            window.location.href = "/";
          }).catch(() => {
            messageTitle("取消强制退出！", "warning");
          })
        }
      })
    }
  }
}

</script>

<style scoped>
  .menuTitle{
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 20px;
    font-family: "YouYuan";
    color: mediumturquoise;
  }

  .el-aside{
    background: lightsteelblue;
  }
  .el-header{
    background: azure;
    height: 35px;
    line-height: 35px;

  }
  .el-footer{
    background: aliceblue;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .rightContext{
   height: calc(100vh);
  }
  .show{
    cursor: pointer;
  }
  .el-dropdown {
    line-height: 35px;
    float: right;
    cursor: pointer;
  }
</style>