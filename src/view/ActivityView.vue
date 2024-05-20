<template>
  <el-form :inline="true" :model="activityQuery" :rules="activityRules">

    <el-form-item label="负责人">
      <el-select v-model="activityQuery.ownerId" placeholder="请选择负责人" clearable @click="loadOwner()"
                 style="width: 200px">
        <el-option
            v-for="item in ownerOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称">
      <el-input v-model="activityQuery.name" placeholder="活动名称" clearable/>
    </el-form-item>

    <el-form-item label="活动时间">
      <el-date-picker
          v-model="activityQuery.activityTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss">
      </el-date-picker>
    </el-form-item>

      <el-form-item label="活动预算" prop="cost">
        <el-input v-model="activityQuery.cost" placeholder="活动预算" clearable/>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
            v-model="activityQuery.createTime"
            type="datetime"
            placeholder="请选择创建时间"
            value-format="YYYY-MM-DD HH:mm:ss">
        </el-date-picker>
      </el-form-item>

      <el-form-item class="activityButton1">
        <el-button type="primary" @click="conditionalSearch()">搜 索</el-button>
        <el-button type="primary" plain @click="onReset()">重 置</el-button>
      </el-form-item>
  </el-form>

  <div class="activityButton">
    <el-button type="primary" @click="add()">录入市场活动</el-button>
    <el-button type="danger" @click="batchDel()">批量删除</el-button>
  </div>

  <el-table
      :data="activityList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />

    <!--    <el-table-column label="序号" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>-->

    <el-table-column type="index" property="name" label="序号" width="120" />
    <el-table-column property="ownerName" label="负责人" width="120" />
    <el-table-column property="name" label="活动名称" show-overflow-tooltip />
    <el-table-column property="startTime" label="开始时间" show-overflow-tooltip />
    <el-table-column property="endTime" label="结束时间" show-overflow-tooltip />
    <el-table-column property="cost" label="活动预算" show-overflow-tooltip />
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
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

</template>

<script>
import {doDelete, doGet} from "../http/httpRequest";
import {messagePrompt, messageTitle} from "../util/utils";

export default {
  name: "ActivityView",

  inject: ['reload'],

  data() {
    return {
      activityQuery: {},
      activityList: [{}],
      pageSize: 0,
      total: 0,
      ownerOption: [{}],
      activityIdArray: [],
      activityRules: [
        {pattern: /^[0-9]+(\.[0-9]{2})?$/, message: '活动预算必须为整数或者两位小数', trigger: 'blur'}
      ]
    }
  },

  mounted() {
    this.getActivityList(1);
  },

  methods: {
    // // 当选择项发生变化时会触发该事件
    handleSelectionChange(selectionDataArray) {
      this.activityIdArray = [];
      selectionDataArray.forEach(data => {
        let id = data.id;
        this.activityIdArray.push(id);
      })
    },

    // 获取活动集合
    getActivityList(currentPage) {

      let startTime = '';
      let endTime = '';
      for (let key in this.activityQuery.activityTime) {
        if (key === '0') {
          startTime = this.activityQuery.activityTime[key];
        }
        if (key === '1') {
          endTime = this.activityQuery.activityTime[key];
        }
      }
      doGet("/api/activity/activityList", {
        currentPage: currentPage,
        ownerId: this.activityQuery.ownerId,
        name: this.activityQuery.name,
        cost: this.activityQuery.cost,
        createTime: this.activityQuery.createTime,
        startTime: startTime,
        endTime: endTime
      }).then(resp => {
        if (resp.data.code === 0) {
          //console.log(resp)
          this.activityList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 分页查询
    toPage(currentPage) {
      //console.log(currentPage);
      this.getActivityList(currentPage);
    },

    // 加载负责人名字
    loadOwner() {
      doGet("/api/user/getOwner").then(resp => {
        if (resp.data.code === 0) {
          this.ownerOption = resp.data.data;
        }
      })
    },

    // 条件查询
    conditionalSearch() {
      this.getActivityList(1);
    },
    // 重置按钮
    onReset() {
      this.activityQuery = {}
    },

    // 录入市场活动
    add() {
      this.$router.push("/dashboard/activity/add");
    },

    // 编辑市场活动按钮
    edit(id) {
      this.$router.push("/dashboard/activity/edit/" + id);
    },

    // 市场活动详情按钮
    view(id) {
      this.$router.push("/dashboard/activity/detail/" + id);
    },

    // 市场活动删除按钮
    del(id) {
      messagePrompt("您确定要删除该条市场活动？").then(() => {
        doDelete("/api/activity/deleteActivity", {id}).then(resp => {
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
    },

    // 批量删除市场活动
    batchDel() {
      if (this.activityIdArray <= 0) {
        messageTitle("请选择要删除的市场活动", "warning");
        return;
      }
      messagePrompt("您确定要删除已选择的多条市场活动？").then(() => {
        let ids = this.activityIdArray.join(",");
        doDelete("/api/activity/batchDeleteActivity", {ids}).then(resp => {
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

  }
}
</script>

<style scoped>

 .el-pagination {
  margin-top: 15px;
 }


 .activityButton {
   margin-top: 5px;
   margin-bottom: 20px;
 }


</style>