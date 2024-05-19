<template>
  <el-form :model="activityRemark" ref="activityFormRef" label-width="auto" style="max-width: 600px" :rules="activityRemarkRules">
    <el-form-item label="市场活动 ID">
      <div class="detailDiv">&nbsp;{{ activityDetail.id }}</div>
    </el-form-item>
    <el-form-item label="负责人">
      <div class="detailDiv">&nbsp;{{ activityDetail.ownerName }}</div>
    </el-form-item>
    <el-form-item label="活动名称">
      <div class="detailDiv">&nbsp;{{ activityDetail.name }}</div>
    </el-form-item>
    <el-form-item label="开始时间">
      <div class="detailDiv">&nbsp;{{ activityDetail.startTime }}</div>
    </el-form-item>
    <el-form-item label="结束时间">
      <div class="detailDiv">&nbsp;{{ activityDetail.endTime }}</div>
    </el-form-item>
    <el-form-item label="创建时间">
      <div class="detailDiv">&nbsp;{{ activityDetail.createTime }}</div>
    </el-form-item>
    <el-form-item label="创建人">
      <div class="detailDiv">&nbsp;{{ activityDetail.createName }}</div>
    </el-form-item>
    <el-form-item label="编辑时间">
      <div class="detailDiv">&nbsp;{{ activityDetail.editTime }}</div>
    </el-form-item>
    <el-form-item label="编辑人">
      <div class="detailDiv">&nbsp;{{ activityDetail.editName }}</div>
    </el-form-item>
    <el-form-item label="活动预算">
      <div class="detailDiv">&nbsp;{{ activityDetail.cost }}</div>
    </el-form-item>
    <el-form-item label="活动描述">
      <div class="detailDiv">&nbsp;{{ activityDetail.description }}</div>
    </el-form-item>

    <el-form-item label="活动备注" prop="noteContent">
      <el-input
          v-model="activityRemark.noteContent"
          style="width: 1000px"
          :rows="8"
          type="textarea"
          placeholder="请输入活动备注信息"
      />
    </el-form-item>

    <div class="dialog-footer">
      <el-button type="primary" @click="activityRemarkSubmit()">提 交</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="goHistory()">返 回</el-button>
    </div>
  </el-form>

</template>

<script>
import {doGet, doPost} from "../http/httpRequest";
import {messageTitle} from "../util/utils";

export default {
  name: "ActivityDetailView",

  inject: ['reload'],

  data() {
    return {
      activityDetail: {},
      activityRemark: {},
      activityRemarkRules: {
        noteContent: [
          { required: true, message: '请输入活动备注信息', trigger: 'blur' },
          { min: 5, max: 255, message: '活动备注信息为5-255个字符', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.loadActivityDetail();
  },

  methods: {
    loadActivityDetail() {
      let id = this.$route.params.id;
      doGet("/api/activity/activityDetailInfo/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.activityDetail = resp.data.data;
        }
      })
    },

    // 返回按钮
    goHistory() {
      this.$router.go(-1);
    },

    // 提交按钮
    activityRemarkSubmit() {
      this.$refs.activityFormRef.validate(isValidate => {
        if (isValidate) {
          let activityId = this.$route.params.id;
          doPost("/api/activityRemark/addActivityRemark", {
            activityId: activityId,
            noteContent: this.activityRemark.noteContent
          }).then(resp => {
            if (resp.data.code === 0) {
              messageTitle("添加市场活动备注信息成功！", "success");
              this.reload();
            } else {
              messageTitle("添加市场活动备注信息失败！", "error");
            }
          })
        }
      })
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
.dialog-footer {
  margin-left: 100px;
}
</style>