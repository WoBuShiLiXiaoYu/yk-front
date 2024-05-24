<template>

  <el-form :model="customerDetail" ref="activityFormRef" label-width="auto" style="max-width: 600px">
    <el-form-item label="线索 ID">
      <div class="detailDiv">&nbsp;{{ customerDetail.clueId }}</div>
    </el-form-item>
    <el-form-item label="负责人">
      <div class="detailDiv">&nbsp;{{ customerDetail.ownerName }}</div>
    </el-form-item>
    <el-form-item label="活动名称">
      <div class="detailDiv">&nbsp;{{ customerDetail.activityName }}</div>
    </el-form-item>
    <el-form-item label="姓名">
      <div class="detailDiv">&nbsp;{{ customerDetail.fullName }}</div>
    </el-form-item>
    <el-form-item label="称呼">
      <div class="detailDiv">&nbsp;{{ customerDetail.appellationName }}</div>
    </el-form-item>
    <el-form-item label="手机号">
      <div class="detailDiv">&nbsp;{{ customerDetail.phone }}</div>
    </el-form-item>
    <el-form-item label="微信号">
      <div class="detailDiv">&nbsp;{{ customerDetail.weixin }}</div>
    </el-form-item>
    <el-form-item label="QQ">
      <div class="detailDiv">&nbsp;{{ customerDetail.qq }}</div>
    </el-form-item>
    <el-form-item label="邮箱">
      <div class="detailDiv">&nbsp;{{ customerDetail.email }}</div>
    </el-form-item>
    <el-form-item label="年龄">
      <div class="detailDiv">&nbsp;{{ customerDetail.age }}</div>
    </el-form-item>
    <el-form-item label="职业">
      <div class="detailDiv">&nbsp;{{ customerDetail.job }}</div>
    </el-form-item>
    <el-form-item label="年收入">
      <div class="detailDiv">&nbsp;{{ customerDetail.yearIncome }}</div>
    </el-form-item>
    <el-form-item label="地址">
      <div class="detailDiv">&nbsp;{{ customerDetail.address }}</div>
    </el-form-item>
    <el-form-item label="是否需要贷款">
      <div class="detailDiv">&nbsp;{{ customerDetail.isNeedLoan }}</div>
    </el-form-item>
    <el-form-item label="意向状态">
      <div class="detailDiv">&nbsp;{{ customerDetail.intentionStateType }}</div>
    </el-form-item>
    <el-form-item label="意向产品">
      <div class="detailDiv">&nbsp;{{ customerDetail.intentionProductName }}</div>
    </el-form-item>
    <el-form-item label="线索状态">
      <div class="detailDiv">&nbsp;{{ customerDetail.clueState }}</div>
    </el-form-item>
    <el-form-item label="线索来源">
      <div class="detailDiv">&nbsp;{{ customerDetail.clueSource }}</div>
    </el-form-item>
    <el-form-item label="线索描述">
      <div class="detailDiv">&nbsp;{{ customerDetail.description }}</div>
    </el-form-item>
    <el-form-item label="创建人">
      <div class="detailDiv">&nbsp;{{ customerDetail.createName }}</div>
    </el-form-item>
    <el-form-item label="创建时间">
      <div class="detailDiv">&nbsp;{{ customerDetail.createTime }}</div>
    </el-form-item>
    <el-form-item label="编辑人">
      <div class="detailDiv">&nbsp;{{ customerDetail.editName }}</div>
    </el-form-item>
    <el-form-item label="编辑时间">
      <div class="detailDiv">&nbsp;{{ customerDetail.editTime }}</div>
    </el-form-item>
    <el-form-item label="下次联系时间">
      <div class="detailDiv">&nbsp;{{ customerDetail.nextContactTime }}</div>
    </el-form-item>

    <div class="button-footer">
      <el-button type="success" @click="goHistory()">返 回</el-button>
    </div>

  </el-form>

</template>

<script>
import {doGet} from "../http/httpRequest";

export default {
  name: "CustomerDetailView",
  data() {
    return {
      customerDetail: {}
    }
  },

  mounted() {

    this.loadCustomer();
  },

  methods: {
    // 返回
    goHistory() {
      this.$router.go(-1);
    },

    // 加载客户详细信息
    loadCustomer() {
      let id = this.$route.params.id;
      doGet("/api/customer/getCustomerDetail/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.customerDetail = resp.data.data;
        }
      })
    }
  }
}
</script>

<style scoped>
.button-footer {
  margin-left: 140px;
  margin-top: 30px;
}

.detailDiv {
  background: azure;
  width: 100%;
  padding-left: 15px
}
</style>