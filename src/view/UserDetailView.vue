<template>
  <el-form :model="userDetail" label-width="auto" style="max-width: 600px">
    <el-form-item label="用户ID">
      <div class="detailDiv">&nbsp;{{ userDetail.id }}</div>
    </el-form-item>
    <el-form-item label="登录账号">
      <div class="detailDiv">&nbsp;{{ userDetail.loginAct }}</div>
    </el-form-item><el-form-item label="登录密码">
    <div class="detailDiv">******</div>
  </el-form-item><el-form-item label="用户姓名">
    <div class="detailDiv">&nbsp;{{ userDetail.name }}</div>
  </el-form-item><el-form-item label="用户手机">
    <div class="detailDiv">&nbsp;{{ userDetail.phone }}</div>
  </el-form-item><el-form-item label="用户邮箱">
    <div class="detailDiv">&nbsp;{{ userDetail.email }}</div>
  </el-form-item><el-form-item label="账户是否过期">
    <div class="detailDiv">&nbsp;{{ userDetail.accountNoExpired === 1 ? "正常" : "已过期"}}</div>
  </el-form-item><el-form-item label="密码是否过期">
    <div class="detailDiv">&nbsp;{{ userDetail.credentialsNoExpired === 1 ? "正常" : "已过期"}}</div>
  </el-form-item><el-form-item label="账号是否锁定">
    <div class="detailDiv">&nbsp;{{ userDetail.accountNoLocked === 1 ? "正常" : "已锁定"}}</div>
  </el-form-item><el-form-item label="账号是否启用">
    <div class="detailDiv">&nbsp;{{ userDetail.accountEnabled === 1 ? "启用" : "禁用"}}</div>
  </el-form-item><el-form-item label="创建时间">
    <div class="detailDiv">&nbsp;{{ userDetail.createTime }}</div>
  </el-form-item><el-form-item label="创建人">
    <div class="detailDiv">&nbsp;{{ userDetail.createName }}</div>
  </el-form-item><el-form-item label="编辑时间">
    <div class="detailDiv">&nbsp;{{ userDetail.editTime }}</div>
  </el-form-item><el-form-item label="编辑人">
    <div class="detailDiv">&nbsp;{{ userDetail.editName }}</div>
  </el-form-item>
    <el-form-item label="最近登录时间">
      <div class="detailDiv">&nbsp;{{ userDetail.lastLoginTime }}</div>
  </el-form-item>
  </el-form>

  <el-button type="success" element-loading-background @click="goHistory()">返回</el-button>
</template>

<script>
import {doGet} from "../http/httpRequest";

export default {
  name: "UserDetailView",

  data() {
    return {
      userDetail: {}
    }
  },

  mounted() {
    this.loadUserDetail();
  },

  methods: {
    // 加载用户详细信息
    loadUserDetail() {
      let id = this.$route.params.id;
      doGet("/api/user/userDetailInfo/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.userDetail = resp.data.data;
        }
      })
    },

    // 返回上页
    goHistory() {
      this.$router.go(-1);
    }

  }
}
</script>

<style scoped>
.detailDiv {
  background: azure;
  width: 100%;
  padding-left: 15px
}

.el-button {
  margin-top: 20px;
  margin-left: 30px;
}
</style>