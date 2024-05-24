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

    <div class="button-footer">
      <el-button type="primary" @click="activityRemarkSubmit()">提 交</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="goHistory()">返 回</el-button>
    </div>
  </el-form>

  <el-table
      :data="activityRemarkList"
      style="width: 100%">
    <el-table-column type="index" label="序号" width="60" />
    <el-table-column property="noteContent" label="备注内容" width="200" />
    <el-table-column property="createTime" label="备注时间" show-overflow-tooltip />
    <el-table-column property="createName" label="备注人" show-overflow-tooltip />
    <el-table-column property="editTime" label="编辑时间" show-overflow-tooltip />
    <el-table-column property="editName" label="编辑人" show-overflow-tooltip />
    <el-table-column label="操作" show-overflow-tooltip >
      <template #default="scope">
        <el-button type="success" @click="edit(scope.row.id)">编辑</el-button>
        <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
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

  <!--编辑备注信息弹窗-->
  <el-dialog v-model="editDialogVisible" title="编辑市场活动备注信息" center width="45%" draggable>

    <el-form :model="editRemarkQuery" label-width="30%" style="max-width: 600px" ref="editRemarkFormRef" :rules="editRemarkRules">
      <el-form-item label="活动备注" prop="noteContent">
      <el-input
          v-model="editRemarkQuery.noteContent"
          style="width: 1000px"
          :rows="8"
          type="textarea"
          placeholder="请输入活动备注信息"
      />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="editRemarkSubmit()">提 交</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest";
import {messagePrompt, messageTitle} from "../util/utils";

export default {
  name: "ActivityDetailView",

  inject: ['reload'],

  data() {
    return {
      activityDetail: {},
      activityRemark: {},
      pageSize: 0,
      total: 0,
      activityRemarkList: [{}],
      editDialogVisible: false,
      editRemarkQuery: {},
      editRemarkRules: {
        noteContent: [
          { required: true, message: '请输入活动备注信息', trigger: 'blur' },
          { min: 5, max: 255, message: '活动备注信息为5-255个字符', trigger: 'blur' }
        ]
      },
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
    this.loadActivityRemarkList(1);
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
              messageTitle("添加市场活动备注信息失败！原因：" + resp.data.msg, "error");
            }
          })
        }
      })
    },

    // 加载备注信息
    loadActivityRemarkList(currentPage) {
      let activityId = this.$route.params.id;
      doGet("/api/activityRemark/getActivityRemarkList/" + activityId, {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          this.activityRemarkList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    toPage(currentPage) {
      this.loadActivityRemarkList(currentPage);
    },

    // 编辑按钮
    edit(id) {
      this.editDialogVisible = true;
      doGet("/api/activityRemark/getNoteContent/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.editRemarkQuery = resp.data.data;
        }
      })
    },

    // 编辑备注提交按钮
    editRemarkSubmit() {
      this.$refs.editRemarkFormRef.validate(isValid => {
        if (isValid) {
          doPut("/api/activityRemark/editActivityRemark", {
        id: this.editRemarkQuery.id,
        noteContent: this.editRemarkQuery.noteContent
      }).then(resp => {
        if (resp.data.code === 0) {
          messageTitle("编辑市场活动备注成功！", "success");
          // 刷新页面
          this.reload();
        } else {
          messageTitle("编辑市场活动备注失败！", "error");
        }
      })
        }
      })
    },

    // 备注删除按钮
    del(id) {
      messagePrompt("您确定要删除该条备注信息？").then(() => {
        doDelete("/api/activityRemark/deleteActivityRemark", {id}).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("删除市场活动成功！", "success");
            this.reload();
          } else {
            messageTitle("删除市场活动失败！", "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
    }

    // 批量删除市场活动
  }
}
</script>

<style scoped>
.detailDiv {
  background: azure;
  width: 100%;
  padding-left: 15px
}
.button-footer {
  margin-left: 100px;
}
</style>