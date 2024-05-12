<template>
  <el-button type="primary">添加用户</el-button>
  <el-button type="danger">批量删除</el-button>

  <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />

<!--    <el-table-column label="序号" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>-->

    <el-table-column type="index" property="name" label="序号" width="120" />
    <el-table-column property="loginAct" label="账号" width="120" />

    <el-table-column property="name" label="姓名" show-overflow-tooltip />
    <el-table-column property="phone" label="手机" show-overflow-tooltip />
    <el-table-column property="email" label="邮箱" show-overflow-tooltip />
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
    <el-table-column label="操作" show-overflow-tooltip >

    </el-table-column>
  </el-table>

  <el-pagination background
                 layout="prev, pager, next"
                 v-model:page-size="pageSize"
                 v-model:total="total"
                 v-model:current-page="currentPage"
                 @prev-click="toPage()"
                 @next-click="toPage()"
                 @current-change="toPage()"/>
</template>

<script>
import {doGet} from "../http/httpRequest";

export default {
  name: "User",

  data() {
    return {
      userList: [{}],
      pageSize: 0,
      total: 0,
      currentPage: 0
    }
  },

  mounted() {
    this.getUserList(1);
  },

  methods: {
    // 当选择项发生变化时会触发该事件
    handleSelectionChange() {},

    // 查询用户列表
    getUserList(currentPage) {
      doGet("/api/user/userList", {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          console.log(resp)
          this.userList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 分页查询
    toPage(currentPage) {
      this.getUserList(currentPage);
    }


  }
}
</script>

<style scoped>
  .el-pagination {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 15px;
  }
</style>