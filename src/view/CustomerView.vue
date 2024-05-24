<template>
  <el-button type="primary" class="btn" @click="batchExportExcel()">批量导出(Excel)</el-button>
  <el-button type="success" class="btn" @click="chooseExportExcel()">选择导出(Excel)</el-button>

  <el-table
      :data="customerList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="index" property="name" label="序号" width="60" />
    <el-table-column property="ownerName" label="负责人" width="100" />
    <el-table-column property="activityName" label="所属活动" show-overflow-tooltip />
    <el-table-column label="姓名" show-overflow-tooltip >
      <template #default="scope">
        <a href="javescript:" @click="view(scope.row.id)"> {{scope.row.fullName}} </a>
      </template>
    </el-table-column>
    <el-table-column property="appellationName" label="称呼" show-overflow-tooltip />
    <el-table-column property="phone" label="手机" show-overflow-tooltip />
    <el-table-column property="weixin" label="微信" show-overflow-tooltip />
    <el-table-column property="isNeedLoan" label="是否贷款" show-overflow-tooltip />
    <el-table-column property="intentionStateType" label="意向状态" show-overflow-tooltip />
    <el-table-column property="intentionProductName" label="意向产品" show-overflow-tooltip />
    <el-table-column property="clueState" label="线索状态" show-overflow-tooltip >
      <template #default="scope">
        <span style="background: lemonchiffon" v-if="scope.row.clueState == '已转客户'"> {{scope.row.clueState}} </span>
        <span v-else> {{scope.row.clueState}} </span>
      </template>
    </el-table-column>
    <el-table-column property="clueSource" label="线索来源" show-overflow-tooltip />
    <el-table-column property="nextContactTime" label="下次联系时间" width="200" show-overflow-tooltip />
    <el-table-column label="操作" width="230" >

      <template #default="scope">
        <el-button type="primary" @click="view(scope.row.id)">详情</el-button>
      </template>
    </el-table-column>

  </el-table>

  <!-- 分页组件 -->
  <el-pagination background
                 layout="prev, pager, next"
                 v-model:page-size="pageSize"
                 v-model:total="total"
                 @prev-click="toPage"
                 @next-click="toPage"
                 @current-change="toPage"/>
</template>

<script>
import {doGet} from "../http/httpRequest";
import axios from "axios";
import {getToken, messageTitle} from "../util/utils";

export default {
  name: "CustomerView",
  inject: ['reload'],
  data() {
    return {
      customerList: [{}],
      pageSize: 0,
      total: 0,
      customerIdArray: []
    }
  },

  mounted() {
    this.loadCustomerList(1);
  },

  methods: {
    handleSelectionChange(selectionDataArray) {
      this.customerIdArray = [];
      selectionDataArray.forEach(data => {
        let id = data.id;
        this.customerIdArray.push(id);
      })
    },

    // 加载客户列表
    loadCustomerList(currentPage) {
      doGet("/api/customer/getCustomerList", {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          this.customerList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 分页
    toPage(currentPage) {
      this.loadCustomerList(currentPage);
    },

    // 批量导出 Excel
    batchExportExcel() {
      /*// 设置 iframe 标签对象
      let token = getToken();
      let iframe = document.createElement("iframe");
      iframe.src = axios.defaults.baseURL + "/api/customer/batchExportExcel?authorization=" + token;
      // 隐藏 iframe
      iframe.style.display = "none"
      document.body.appendChild(iframe);*/
      this.exportExcel(null);
    },

    // 导出
    exportExcel(ids) {
      let token = getToken();
      let iframe = document.createElement("iframe");
      if (ids) {
        iframe.src = axios.defaults.baseURL + "/api/customer/chooseExportExcel?authorization=" + token + "&ids=" + ids;
      } else {
        iframe.src = axios.defaults.baseURL + "/api/customer/batchExportExcel?authorization=" + token;
      }
      iframe.style.display = "none"
      document.body.appendChild(iframe);
    },

    // 选择导出 Excel
    chooseExportExcel() {
      /*let ids = this.customerIdArray.join(",");
      let token = getToken();
      let iframe = document.createElement("iframe");
      iframe.src = axios.defaults.baseURL + "/api/customer/chooseExportExcel?authorization=" + token + "&ids=" + ids;
      iframe.style.display = "none"
      document.body.appendChild(iframe);*/
      if (this.customerIdArray.length <= 0) {
        messageTitle("请选择要导出的客户信息", "warning");
        return;
      }
      let ids = this.customerIdArray.join(",");
      this.exportExcel(ids);
      this.reload();
    },

    // 跳转客户详情按钮
    view(id) {
      this.$router.push("/dashboard/customer/detail/" + id);
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 30px;
}
</style>