<template>
  <el-form :model="clueQuery" label-width="30%" style="max-width: 1000px" ref="addClueFormRef" :rules="addClueRules">
    <el-form-item label="负责人">
      <el-select v-model="clueQuery.ownerId" placeholder="请选择负责人" style="width: 1000px" disabled clearable>
        <el-option
            v-for="item in ownerOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="所属活动">
      <el-select v-model="clueQuery.activityId" placeholder="请选择所属活动" style="width: 1000px">
        <el-option
            v-for="item in activityOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="姓名" prop="fullName">
      <el-input type="input" v-model="clueQuery.fullName" />
    </el-form-item>

    <el-form-item label="称呼">
      <el-select v-model="clueQuery.appellation" placeholder="请选择客户称呼" style="width: 1000px">
        <el-option
            v-for="item in appellationOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="手机" v-if="clueQuery.id > 0">
      <el-input type="input" v-model="clueQuery.phone" disabled />
    </el-form-item>

    <el-form-item label="手机" prop="phone" v-else>
      <el-input type="input" v-model="clueQuery.phone" />
    </el-form-item>

    <el-form-item label="微信">
      <el-input type="input" v-model="clueQuery.weixin" />
    </el-form-item>

    <el-form-item label="QQ" prop="qq">
      <el-input type="input" v-model="clueQuery.qq" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input type="input" v-model="clueQuery.email" />
    </el-form-item>

    <el-form-item label="年龄" prop="age">
      <el-input type="input" v-model="clueQuery.age" />
    </el-form-item>

    <el-form-item label="职业">
      <el-input type="input" v-model="clueQuery.job" />
    </el-form-item>

    <el-form-item label="年收入" prop="yearIncome">
      <el-input type="input" v-model="clueQuery.yearIncome" />
    </el-form-item>

    <el-form-item label="住址">
      <el-input type="input" v-model="clueQuery.address" />
    </el-form-item>

    <el-form-item label="意向产品">
      <el-select v-model="clueQuery.intentionProduct" placeholder="请选择意向产品" style="width: 1000px">
        <el-option
            v-for="item in productOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="是否需要贷款">
      <el-select v-model="clueQuery.needLoan" placeholder="请选择是否需要贷款" style="width: 1000px">
        <el-option
            v-for="item in needLoanOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="意向状态">
      <el-select v-model="clueQuery.intentionState" placeholder="请选择意向状态" style="width: 1000px">
        <el-option
            v-for="item in intentionStateOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="线索状态">
      <el-select v-model="clueQuery.state" placeholder="请选择线索状态" style="width: 1000px">
        <el-option
            v-for="item in clueStateOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="线索来源">
      <el-select v-model="clueQuery.source" placeholder="请选择线索来源" style="width: 1000px">
        <el-option
            v-for="item in sourceOption"
            :key="item.id"
            :label="item.typeValue"
            :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="下次联系时间">
      <el-date-picker
          v-model="clueQuery.nextContactTime"
          type="datetime"
          placeholder="请选择下次联系时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 1000px">
      </el-date-picker>
    </el-form-item>


    <el-form-item label="线索描述" prop="description">
      <el-input
          v-model="clueQuery.description"
          style="width: 1000px"
          :rows="5"
          type="textarea"
          placeholder="请输入线索描述信息"
      />
    </el-form-item>

    <div class="button-footer">
      <el-button type="primary" @click="clueSubmit()">提 交</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="goHistory()">返 回</el-button>
    </div>


  </el-form>
</template>

<script>
import {doGet, doPost, doPut} from "../http/httpRequest";
import {messageTitle} from "../util/utils";

export default {
  name: "ClueRecordView",
  inject: ['reload'],
  data() {
    return {
      clueQuery: {},
      ownerOption: [{}],
      activityOption: [{}],
      productOption: [{}],
      appellationOption: [{}],
      needLoanOption: [{}],
      intentionStateOption: [{}],
      clueStateOption: [{}],
      sourceOption: [{}],
      addClueRules: {
        phone: [
          { required: true, message: '请输入用户手机号码', trigger: 'blur' },
          {pattern: /^1[3-9]\d{9}$/, message: '手机号码格式有误', trigger: 'blur'},
          {validator: this.checkPhone, trigger: 'blur'}
        ],
        fullName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5]{0,}$/, message: '请输入中文', trigger: 'blur'}
        ],
        email: [
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式有误', trigger: 'blur'}
        ],
        qq: [
          {pattern: /^\d+$/, message: 'QQ 必须为数字', trigger: 'blur'},
          {min: 5, message: 'QQ至少为 5 位', trigger: 'blur'}
        ],
        age: [
          {pattern: /^\d+$/, message: '年龄必须为数字', trigger: 'blur'}
        ],
        yearIncome: [
          {pattern: /^[0-9]+(\.[0-9]{2})?$/, message: '年收入为整数或两位小数', trigger: 'blur'}
        ],
        description: [
          {min: 5, max: 255, message: '线索描述为 5 至 255 个字符', trigger: 'blur'},
        ]
      },
    }
  },

  mounted() {
    this.loadDicValue('appellation');
    this.loadDicValue('needLoan');
    this.loadDicValue('intentionState');
    this.loadDicValue('clueState');
    this.loadDicValue('source');
    this.loadActivityName();
    this.loadOwnerName();
    this.loadProductName();
    this.loadLoginUser();
    this.loadClue();
  },

  methods: {
    // 返回按钮
    goHistory() {
      this.$router.go(-1);
    },

    // 加载字典数据
    loadDicValue(typeCode) {
      doGet("/api/dicValue/getDicValue/" + typeCode).then(resp => {
        if (resp.data.code === 0) {
          if ('appellation' === typeCode) {
            this.appellationOption = resp.data.data;
          }
          if ('needLoan' === typeCode) {
            this.needLoanOption = resp.data.data;
          }
          if ('intentionState' === typeCode) {
            this.intentionStateOption = resp.data.data;
          }
          if ('clueState' === typeCode) {
            this.clueStateOption = resp.data.data;
          }
          if ('source' === typeCode) {
            this.sourceOption = resp.data.data;
          }
        }
      })
    },

    // 加载所属活动字段
    loadActivityName() {
      doGet("/api/activity/getActivityName").then(resp => {
        if (resp.data.code === 0) {
          this.activityOption = resp.data.data;
        }
      })
    },

    // 加载负责人
    loadOwnerName() {
      doGet("/api/user/getOwner").then(resp => {
        if (resp.data.code === 0) {
          this.ownerOption = resp.data.data;
        }
      })
    },

    // 加载当前登录用户
    loadLoginUser() {
      doGet("/api/user/login/info", null).then(resp => {
        let user = resp.data.data.user;
        this.clueQuery.ownerId = user.id;
      })
    },

    // 加载在售意向产品
    loadProductName() {
      doGet("/api/product/getProductNameList").then(resp => {
        if (resp.data.code === 0) {
          this.productOption = resp.data.data;
        }
      })
    },

    // 加载线索
    loadClue() {
      let id = this.$route.params.id;
      if (id) {
        // 编辑
        doGet("/api/clue/getClueInfo/" + id).then(resp => {
          if (resp.data.code === 0) {
            this.clueQuery = resp.data.data;
          }
        })
      }
    },

    // 查询手机号
    checkPhone(rule, value, callback) {
      let phone = value;
      if (phone) {
        doGet("/api/clue/checkPhone/" + phone).then(resp => {
          if (resp.data.code === 50000) {
            return callback(new Error("该手机号已录入过！"));
          } else {
            return callback();
          }
        })
      }
    },

    // 提交按钮
    clueSubmit() {
      let formData = new FormData();
      for (let field in this.clueQuery) {
        if (this.clueQuery[field]) {
          formData.append(field, this.clueQuery[field]);
        }
      }
      this.$refs.addClueFormRef.validate(isValid => {
        if (isValid) {
          if (this.clueQuery.id > 0) {
            // 编辑
            doPut("/api/clue/editClue", formData).then(resp => {
              if (resp.data.code === 0) {
                messageTitle("编辑线索成功！", "success");
                this.$router.push("/dashboard/clue");
              } else {
                messageTitle("编辑线索失败！", "error");
              }
            })
          } else {
            // 提交
            doPost("/api/clue/addClue", formData).then(resp => {
              if (resp.data.code === 0) {
                messageTitle("录入线索成功！", "success");
                this.$router.push("/dashboard/clue");
              } else {
                messageTitle("录入线索失败！", "error");
              }
            })
          }
        }
      })
    }

  }
}
</script>

<style scoped>
.button-footer {
  margin-left: 50%;
  margin-top: 40px;
}
</style>