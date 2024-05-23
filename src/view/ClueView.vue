<template>
  <el-button type="primary" class="btn" @click="addClue()">录入线索</el-button>
  <el-button type="success" class="btn" @click="importExcel()">导入线索(Excel)</el-button>
  <el-button type="danger" class="btn" @click="batchDelClue()">批量删除</el-button>

  <el-table
      :data="clueList"
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


  <!-- 文件上传弹窗 -->
  <el-dialog v-model="importDialogVisible" title="导入 Excel" center width="45%" draggable>
    <el-upload
        ref="uploadRef"
        class="upload-demo"
        :http-request="uploadFile"
        method="post"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选择 Excel 文件</el-button>
      </template>
      仅支持后缀名为 .xls 或 .xlsx 的文件
      <template #tip>
        <div class="el-upload__tip">
          重要提示：
          <ul>
            <li>上传仅支持后缀名为 .xls 或 .xlsx 的文件；</li>
            <li>给定 Excel 文件的第一行将视为字段名；</li>
            <li>请确认您的文件大小不超过 50MB；</li>
            <li>日期值以文本形式保存，必须符合 yyyy-MM-dd HH:mm:ss 的格式；</li>
            <li>日期时间以文本形式保存，必须符合 yyyy-MM-dd HH:mm:ss 的格式；</li>
          </ul>
        </div>
      </template>
    </el-upload>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="importDialogVisible = false">关 闭</el-button>
        <el-button type="success" @click="submitExcel()">上 传</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {doDelete, doGet, doPost} from "../http/httpRequest";
import {messagePrompt, messageTitle} from "../util/utils";

export default {
  name: "ClueView",
  inject: ['reload'],
  data() {
    return {
      clueList: [{}],
      pageSize: 0,
      total: 0,
      importDialogVisible: false,
      clueIdArray: []
    }
  },

  mounted() {
    this.getClueList(1);
  },

  methods: {
    handleSelectionChange(selectionDataArray) {
      this.clueIdArray = [];
      selectionDataArray.forEach(data => {
        let id = data.id;
        this.clueIdArray.push(id);
      })
    },

    // 获取线索列表
    getClueList(currentPage) {
      doGet("/api/clue/getClueList", {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          this.clueList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 分页
    toPage(currentPage) {
      this.getClueList(currentPage);
    },

    // 导入 Excel 按钮
    importExcel() {
      this.importDialogVisible = true;
    },

    // 导入文件
    uploadFile(param) {
      console.log(param);
      let fileName = param.file.name;
      let fileSuffixName = fileName.substr(fileName.lastIndexOf("."));
      // 验证文件后缀名
      if (fileSuffixName === '.xlsx' || fileSuffixName === '.xls') {
        let formData = new FormData();
        let file = param.file;
        formData.append("file", file);
        doPost("/api/clue/importExcel", formData).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("文件导入成功！", "success");
            this.reload();
          } else {
            messageTitle("文件导入失败！", "error");
          }
        })
      } else {
        messageTitle("文件后缀名不正确！请重新确认！", "warning");
      }
    },

    // 导入文件按钮
    submitExcel() {
      this.$refs.uploadRef.submit();
    },

    // 录入线索按钮
    addClue() {
      this.$router.push("/dashboard/clue/add");
    },

    // 编辑按钮
    edit(id) {
      this.$router.push("/dashboard/clue/edit/" + id);
    },

    // 详情
    view(id) {
      this.$router.push("/dashboard/clue/detail/" + id);
    },

    // 删除按钮
    del(id) {
      messagePrompt("您确定要删除该条线索？").then(() => {
        doDelete("/api/clue/deleteClue/" + id).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("删除线索成功！", "success");
            this.reload();
          } else {
            messageTitle("删除线索失败！", "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
    },

    // 批量删除
    batchDelClue() {
      if (this.clueIdArray <= 0) {
        messageTitle("请选择要删除的线索", "warning");
        return;
      }
      messagePrompt("您确定要删除已选择的多条线索？").then(() => {
        let ids = this.clueIdArray.join(",");
        doDelete("/api/clue/batchDeleteClue", {ids}).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("删除线索成功！", "success");
            this.reload();
          } else {
            messageTitle("删除线索失败！", "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
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
.el-upload__tip {
  padding-top: 15px;
  font-size: initial;
  font-family: "Microsoft YaHei";
}
</style>