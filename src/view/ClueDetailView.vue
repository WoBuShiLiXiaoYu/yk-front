<template>
  <el-form :model="clueRemark" ref="clueFormRef" label-width="auto" style="max-width: 600px" :rules="clueRemarkRules">
    <el-form-item label="负责人">
      <div class="detailDiv">&nbsp;{{ clueDetail.ownerName }}</div>
    </el-form-item>
    <el-form-item label="所属活动">
      <div class="detailDiv">&nbsp;{{ clueDetail.activityName }}</div>
    </el-form-item>
    <el-form-item label="姓名">
      <div class="detailDiv">&nbsp;{{ clueDetail.fullName }}</div>
    </el-form-item>
    <el-form-item label="称呼">
      <div class="detailDiv">&nbsp;{{ clueDetail.appellationName }}</div>
    </el-form-item>
    <el-form-item label="手机号">
      <div class="detailDiv">&nbsp;{{ clueDetail.phone }}</div>
    </el-form-item>
    <el-form-item label="微信号">
      <div class="detailDiv">&nbsp;{{ clueDetail.weixin }}</div>
    </el-form-item>
    <el-form-item label="QQ">
      <div class="detailDiv">&nbsp;{{ clueDetail.qq }}</div>
    </el-form-item>
    <el-form-item label="邮箱">
      <div class="detailDiv">&nbsp;{{ clueDetail.email }}</div>
    </el-form-item>
    <el-form-item label="年龄">
      <div class="detailDiv">&nbsp;{{ clueDetail.age }}</div>
    </el-form-item>
    <el-form-item label="职业">
      <div class="detailDiv">&nbsp;{{ clueDetail.job }}</div>
    </el-form-item>
    <el-form-item label="年收入">
      <div class="detailDiv">&nbsp;{{ clueDetail.yearIncome }}</div>
    </el-form-item>
    <el-form-item label="地址">
      <div class="detailDiv">&nbsp;{{ clueDetail.address }}</div>
    </el-form-item>
    <el-form-item label="是否需要贷款">
      <div class="detailDiv">&nbsp;{{ clueDetail.isNeedLoan }}</div>
    </el-form-item>
    <el-form-item label="意向状态">
      <div class="detailDiv">&nbsp;{{ clueDetail.intentionStateType }}</div>
    </el-form-item>
    <el-form-item label="意向产品">
      <div class="detailDiv">&nbsp;{{ clueDetail.intentionProductName }}</div>
    </el-form-item>
    <el-form-item label="线索状态">
      <div class="detailDiv">&nbsp;{{ clueDetail.clueState }}</div>
    </el-form-item>
    <el-form-item label="线索来源">
      <div class="detailDiv">&nbsp;{{ clueDetail.clueSource }}</div>
    </el-form-item>
    <el-form-item label="线索描述">
      <div class="detailDiv">&nbsp;{{ clueDetail.description }}</div>
    </el-form-item>
    <el-form-item label="下次联系时间">
      <div class="detailDiv">&nbsp;{{ clueDetail.nextContactTime }}</div>
    </el-form-item>

    <el-form-item label="填写跟踪记录" prop="noteContent">
      <el-input
          v-model="clueRemark.noteContent"
          style="width: 1000px"
          :rows="8"
          type="textarea"
          placeholder="请输入跟踪记录信息"
      />
    </el-form-item>

    <el-form-item label="跟踪方式" prop="noteWay">
      <el-select v-model="clueRemark.noteWay" placeholder="请选择跟踪方式" style="width: 1000px" @click="loadDicValue('noteWay')">
        <el-option
            v-for="item in noteWayOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <div class="button-footer">
      <el-button type="primary" @click="clueRemarkSubmit()">提 交</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="success" @click="convertCustomer()">转换客户</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="goHistory()">返 回</el-button>
    </div>

  </el-form>

  <el-table class="remarkList"
      :data="clueRemarkList"
      style="width: 100%">
    <el-table-column type="index" label="序号" width="60" />
    <el-table-column property="noteWayValue" label="跟踪方式" show-overflow-tooltip />
    <el-table-column property="noteContent" label="跟踪内容" width="200" />
    <el-table-column property="createTime" label="跟踪时间" show-overflow-tooltip />
    <el-table-column property="createName" label="跟踪人" show-overflow-tooltip />
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

  <!-- 编辑线索跟踪信息 -->
  <el-dialog v-model="editDialogVisible" title="编辑线索跟踪备注信息" center width="45%" draggable>

    <el-form :model="editRemarkQuery" label-width="30%" style="max-width: 600px" ref="editRemarkFormRef" :rules="editRemarkRules">
      <el-form-item label="线索跟踪" prop="noteContent">
        <el-input
            v-model="editRemarkQuery.noteContent"
            style="width: 1000px"
            :rows="8"
            type="textarea"
            placeholder="请输入线索跟踪信息"
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
import {doGet, doPost} from "../http/httpRequest";
import {messageTitle} from "../util/utils";

export default {
  name: "ClueDetailView",
  inject: ['reload'],

  data() {
    return {
      clueDetail: {},
      clueRemark: {},
      noteWayOption: [{}],
      clueRemarkList: [{}],
      pageSize: 0,
      total: 0,
      editDialogVisible: false,
      editRemarkQuery: {},
      clueRemarkRules: {}
    }
  },

  mounted() {
    this.loadClueDetailInfo();
    this.loadClueRemarkList(1);
  },

  methods: {
    // 返回按钮
    goHistory() {
      this.$router.go(-1);
    },

    // 加载线索详细信息
    loadClueDetailInfo() {
      let id = this.$route.params.id;
      doGet("/api/clue/getClueDetailInfo/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.clueDetail = resp.data.data;
        }
      })
    },

    // 加载字典数据
    loadDicValue(typeCode) {
      doGet("/api/dicValue/getDicValue/" + typeCode).then(resp => {
        if (resp.data.code === 0) {
          if ('noteWay' === typeCode) {
            this.noteWayOption = resp.data.data;
          }
        }
      })
    },

    // 提交跟踪记录
    clueRemarkSubmit() {
      doPost("/api/clueRemark/addClueRemark", {
        clueId: this.clueDetail.id,
        noteWay: this.clueRemark.noteWay,
        noteContent: this.clueRemark.noteContent
      }).then(resp => {
        if (resp.data.code === 0) {
          messageTitle("添加跟踪方式成功！", "success");
          this.reload();
        } else {
          messageTitle("添加跟踪方式失败！", "error");
        }
      })
    },

    // 加载线索跟踪历史
    loadClueRemarkList(currentPage) {
      let clueId = this.$route.params.id;
      doGet("/api/clueRemark/getClueRemarkList/" + clueId, {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          this.clueRemarkList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },
    // 分页
    toPage(current) {
      this.loadClueRemarkList(current);
    },

    // 编辑按钮
    edit(id) {
      this.editDialogVisible = true;

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
.button-footer {
  margin-left: 170px;
}
.el-pagination {
  margin-top: 20px;
}
.remarkList {
  margin-top: 20px;
}
</style>