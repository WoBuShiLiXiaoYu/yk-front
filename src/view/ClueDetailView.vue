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
      <el-button type="success" @click="convertCustomer()" v-if="clueDetail.clueState !== '已转客户'">转换客户</el-button>
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

  <!-- 编辑线索跟踪信息弹窗 -->
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

  <!-- 线索转换客户弹窗 -->
  <el-dialog v-model="convertCustomerDialogVisible" title="线索转换客户" center width="45%" draggable>

    <el-form :model="toCustomerQuery" label-width="30%" style="max-width: 600px" ref="toCustomerFormRef"
             :rules="toCustomerRules">
      <el-form-item label="意向产品" prop="product">
        <el-select v-model="toCustomerQuery.product" placeholder="请选择意向产品" style="width: 1000px" @click="loadProduct()">
          <el-option
              v-for="item in productOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户描述" prop="description">
        <el-input
            v-model="toCustomerQuery.description"
            style="width: 1000px"
            :rows="8"
            type="textarea"
            placeholder="请输入客户描述信息"
        />
      </el-form-item>
      <el-form-item label="下次联系时间" prop="nextContactTime">
        <el-date-picker
            v-model="toCustomerQuery.nextContactTime"
            type="datetime"
            placeholder="请选择下次联系时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 1000px">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="convertCustomerDialogVisible = false">关 闭</el-button>
        <el-button type="success" @click="conversionSubmit()">转 换</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest";
import {messagePrompt, messageTitle} from "../util/utils";

export default {
  name: "ClueDetailView",
  inject: ['reload'],

  data() {
    return {
      clueDetail: {},
      clueRemark: {},
      noteWayOption: [{}],
      productOption: [{}],
      clueRemarkList: [{}],
      pageSize: 0,
      total: 0,
      editDialogVisible: false,
      convertCustomerDialogVisible: false,
      toCustomerQuery: {},
      editRemarkQuery: {},
      clueRemarkRules: {},
      toCustomerRules: {
        product: [
          { required: true, message: '请选择意向产品', trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: '请输入客户描述信息', trigger: 'blur' },
          { min: 5, max: 255, message: '客户描述信息为5-255个字符', trigger: 'blur' }
        ],
        nextContactTime: [
          { required: true, message: '请选择下次联系时间', trigger: ['blur', 'change'] }
        ]
      }
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
          messageTitle(resp.data.msg, "error");
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
      doGet("/api/clueRemark/getNoteContent/" + id).then(resp => {
        if (resp.data.code === 0) {
          this.editRemarkQuery = resp.data.data;
        }
      })
    },

    // 编辑提交按钮
    editRemarkSubmit() {
      doPut("/api/clueRemark/editClueRemark", {
        id: this.editRemarkQuery.id,
        noteContent: this.editRemarkQuery.noteContent
      }).then(resp => {
        if (resp.data.code === 0) {
          messageTitle("编辑线索跟踪信息成功!", "success");
          this.reload();
        } else {
          messageTitle(resp.data.msg, "error");
        }
      })
    },

    // 删除按钮
    del(id) {
      messagePrompt("您确定要删除该条跟踪信息？").then(() => {
        doDelete("/api/clueRemark/deleteClueRemark/" + id).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("删除线索跟踪信息成功！", "success");
            this.reload();
          } else {
            messageTitle(resp.data.msg, "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
    },

    // 加载意向产品
    loadProduct() {
      doGet("/api/product/getProductNameList").then(resp => {
        if (resp.data.code === 0) {
          this.productOption = resp.data.data;
        }
      })
    },

    // 转换客户按钮
    convertCustomer() {
      this.convertCustomerDialogVisible = true;
    },

    // 转换客户弹窗转换提交按钮
    conversionSubmit() {
      this.$refs.toCustomerFormRef.validate((isValid) => {
        if (isValid) {
          doPost("/api/customer/conversionCustomer", {
            clueId: this.clueDetail.id,
            product: this.toCustomerQuery.product,
            description: this.toCustomerQuery.description,
            nextContactTime: this.toCustomerQuery.nextContactTime
          }).then(resp => {
            if (resp.data.code === 0) {
              messageTitle("转换客户成功！", "success");
              this.reload();
            } else {
              messageTitle(resp.data.msg, "error");
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