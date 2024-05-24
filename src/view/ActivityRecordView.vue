<template>
  <el-form :model="activityQuery" label-width="30%" style="max-width: 1000px" ref="addActivityFormRef" :rules="addActivityRules">
    <el-form-item label="负责人" prop="ownerId">
      <el-select v-model="activityQuery.ownerId" placeholder="请选择负责人" style="width: 1000px">
        <el-option
            v-for="item in ownerOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称" prop="name">
      <el-input type="input" v-model="activityQuery.name" />
    </el-form-item>

    <el-form-item label="开始时间" prop="startTime" >
      <el-date-picker
          v-model="activityQuery.startTime"
          type="datetime"
          placeholder="请选择活动开始时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 1000px">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
          v-model="activityQuery.endTime"
          type="datetime"
          placeholder="请选择活动结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 1000px">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="活动预算" prop="cost">
      <el-input type="input" v-model="activityQuery.cost" />
    </el-form-item>

    <el-form-item label="活动描述" prop="description">
      <el-input
          v-model="activityQuery.description"
          style="width: 1000px"
          :rows="5"
          type="textarea"
          placeholder="请输入活动描述信息"
      />
    </el-form-item>
  </el-form>

    <div class="button-footer">
      <el-button type="primary" @click="activitySubmit()">提 交</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="goHistory()">返 回</el-button>
    </div>

</template>

<script>
import {doGet, doPost, doPut} from "../http/httpRequest";
import {messageTitle} from "../util/utils";

export default {
  name: "ActivityRecordView",

  inject: ['reload'],

  data() {
    return {
      activityQuery: {},
      ownerOption: [{}],
      addActivityRules: {
        ownerId: [
          { required: true, message: '请选择负责人', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入活动名称号', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入活动预算', trigger: 'blur' },
          {pattern: /^[0-9]+(\.[0-9]{2})?$/, message: '活动预算必须为整数或者两位小数', trigger: 'blur'}
        ],
        description: [
          { required: true, message: '请输入活动描述信息', trigger: 'blur' },
          { min: 5, max: 255, message: '活动描述信息为5-255个字符', trigger: 'blur' }
        ]
      },

    }
  },

  mounted() {
    this.loadOwner();
    this.loadActivity();
  },

  methods: {
    // 加载负责人名字
    loadOwner() {
      doGet("/api/user/getOwner").then(resp => {
        if (resp.data.code === 0) {
          this.ownerOption = resp.data.data;
        }
      })
    },

    // 返回按钮
    goHistory() {
      this.$router.go(-1);
    },

    // 市场活动提交按钮
    activitySubmit() {
      let formData = new FormData();
      for (let field in this.activityQuery) {
        formData.append(field, this.activityQuery[field]);
      }
      this.$refs.addActivityFormRef.validate(isValidate => {
        if (isValidate) {

          if (this.activityQuery.id > 0) {
            // 编辑
            doPut("/api/activity/editActivity", formData).then(resp => {
              if (resp.data.code === 0) {
                messageTitle("编辑市场活动成功！", "success");
                this.$router.push("/dashboard/activity");
              } else {
                messageTitle(resp.data.msg, "error");
              }
            })
          } else {
            // 录入
            doPost("/api/activity/addActivity", formData).then(resp => {
              if (resp.data.code === 0) {
                messageTitle("录入市场活动成功！", "success");
                // 刷新页面
                this.reload();
              } else {
                messageTitle(resp.data.msg, "error");
              }
            })
          }
        }
      })
    },

    // 加载市场活动信息
    loadActivity() {
      let id = this.$route.params.id;
      if (id) {
        // 编辑
        doGet("/api/activity/getActivityInfo/" + id).then(resp => {
          if (resp.data.code === 0) {
            this.activityQuery = resp.data.data;
          }
        })
      }
    }



  }
}
</script>

<style scoped>
 .button-footer {
   margin-left: 35%;
   margin-top: 100px;
 }
</style>