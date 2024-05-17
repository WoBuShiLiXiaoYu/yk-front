<template>
  <el-button type="primary" @click="add()">新增用户</el-button>
  <el-button type="danger" @click="batchDel()">批量删除</el-button>

  <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />

<!--    <el-table-column label="序号" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>-->

    <el-table-column type="index" property="name" label="序号" width="120" />
    <el-table-column property="loginAct" label="账号" width="120" />

    <el-table-column property="name" label="姓名" show-overflow-tooltip />
    <el-table-column property="phone" label="手机" show-overflow-tooltip />
    <el-table-column property="email" label="邮箱" show-overflow-tooltip />
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
    <el-table-column label="操作" show-overflow-tooltip >

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

  <!--新增用户弹窗-->
  <el-dialog v-model="addDialogVisible" title="新增用户" center width="45%" draggable>

    <el-form :model="userQuery" label-width="30%" style="max-width: 600px" ref="addUserFormRef" :rules="addUserRules">
      <el-form-item label="登录账号" prop="loginAct">
        <el-input type="input" v-model="userQuery.loginAct" />
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPwd">
        <el-input type="password" v-model="userQuery.loginPwd" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input type="input" v-model="userQuery.name" />
      </el-form-item>
      <el-form-item label="用户手机" prop="phone">
        <el-input type="input" v-model="userQuery.phone" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input type="input" v-model="userQuery.email" />
      </el-form-item>
      <el-form-item label="账号状态" prop="accountNoExpired">
        <el-select v-model="userQuery.accountNoExpired" placeholder="请选择" style="width: 600px">
<!--          <el-option label="正常" value="1"/>
          <el-option label="已过期" value="0"/>-->
          <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="密码状态" prop="credentialsNoExpired">
        <el-select v-model="userQuery.credentialsNoExpired" placeholder="请选择" style="width: 600px">
          <el-option label="正常" value="1"/>
          <el-option label="已过期" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账号锁定" prop="accountNoLocked">
        <el-select v-model="userQuery.accountNoLocked" placeholder="请选择" style="width: 600px">
          <el-option label="正常" value="1"/>
          <el-option label="锁定" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账号启用" prop="accountEnabled">
        <el-select v-model="userQuery.accountEnabled" placeholder="请选择" style="width: 600px">
          <el-option label="启用" value="1"/>
          <el-option label="禁用" value="0"/>
        </el-select>
      </el-form-item>


    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="addUserSubmit()">提 交</el-button>
      </div>
    </template>
  </el-dialog>

  <!--编辑用户弹窗-->
  <el-dialog v-model="editDialogVisible" title="编辑用户" center width="45%" draggable>

    <el-form :model="userQuery" label-width="30%" style="max-width: 600px" ref="editUserFormRef" :rules="editUserRules">
      <el-form-item label="登录账号" prop="loginAct">
        <el-input type="input" v-model="userQuery.loginAct" />
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input type="password" v-model="userQuery.loginPwd" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input type="input" v-model="userQuery.name" />
      </el-form-item>
      <el-form-item label="用户手机" prop="phone">
        <el-input type="input" v-model="userQuery.phone" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input type="input" v-model="userQuery.email" />
      </el-form-item>
      <el-form-item label="账号状态" prop="accountNoExpired">
        <el-select v-model="userQuery.accountNoExpired" placeholder="请选择" style="width: 600px">
<!--          <el-option label="正常" value="1"/>
          <el-option label="已过期" value="0"/>-->

          <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="密码状态" prop="credentialsNoExpired">
        <el-select v-model="userQuery.credentialsNoExpired" placeholder="请选择" style="width: 600px">
<!--          <el-option label="正常" value="1"/>
          <el-option label="已过期" value="0"/>-->
          <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账号锁定" prop="accountNoLocked">
        <el-select v-model="userQuery.accountNoLocked" placeholder="请选择" style="width: 600px">
<!--          <el-option label="正常" value="1"/>
          <el-option label="锁定" value="0"/>-->
          <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账号启用" prop="accountEnabled">
        <el-select v-model="userQuery.accountEnabled" placeholder="请选择" style="width: 600px">
<!--          <el-option label="启用" value="1"/>
          <el-option label="禁用" value="0"/>-->
          <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="editUserSubmit()">提 交</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest";
import {messagePrompt, messageTitle} from "../util/utils";

export default {
  name: "User",

  inject: ['reload'],

  data() {
    return {
      userList: [{}],
      pageSize: 0,
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      userQuery: {},
      userIdArray: [],
      option1: [
        {label: '正常', value: 1},
        {label: '已过期', value: 0}
      ],
      option2: [
        {label: '正常', value: 1},
        {label: '锁定', value: 0}
      ],
      option3: [
        {label: '启用', value: 1},
        {label: '禁用', value: 0}
      ],
      addUserRules: {
        loginAct: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
        ],
        loginPwd: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5]{0,}$/, message: '请输入中文', trigger: 'blur'}
        ],
        phone: [
          { required: true, message: '请输入用户手机号码', trigger: 'blur' },
          {pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '手机号码格式有误', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式有误', trigger: 'blur'}
        ],
        accountNoExpired: [
          { required: true, message: '请确定用户账号状态', trigger: ['change', 'blue'] },
        ],
        credentialsNoExpired: [
          { required: true, message: '请确定用户密码状态', trigger: ['change', 'blue'] },
        ],
        accountNoLocked: [
          { required: true, message: '请输入用户账号是否锁定', trigger: ['change', 'blue'] },
        ],
        accountEnabled: [
          { required: true, message: '请输入用户账号是否启用', trigger: ['change', 'blue'] },
        ]
      },
      editUserRules: {
        loginAct: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
        ],
        loginPwd: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5]{0,}$/, message: '请输入中文', trigger: 'blur'}
        ],
        phone: [
          { required: true, message: '请输入用户手机号码', trigger: 'blur' },
          {pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '手机号码格式有误', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式有误', trigger: 'blur'}
        ],
        accountNoExpired: [
          { required: true, message: '请确定用户账号状态', trigger: ['change', 'blue'] },
        ],
        credentialsNoExpired: [
          { required: true, message: '请确定用户密码状态', trigger: ['change', 'blue'] },
        ],
        accountNoLocked: [
          { required: true, message: '请输入用户账号是否锁定', trigger: ['change', 'blue'] },
        ],
        accountEnabled: [
          { required: true, message: '请输入用户账号是否启用', trigger: ['change', 'blue'] },
        ]
      }
    }
  },

  mounted() {
    this.getUserList(1);
  },

  methods: {
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(selectionDataArray) {
      this.userIdArray = [];
      selectionDataArray.forEach(data => {
        let userId = data.id;
        this.userIdArray.push(userId);
      })

    },

    // 查询用户列表
    getUserList(currentPage) {
      doGet("/api/user/userList", {
        currentPage: currentPage
      }).then(resp => {
        if (resp.data.code === 0) {
          //console.log(resp)
          this.userList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 分页查询
    toPage(currentPage) {
      //console.log(currentPage);
      this.getUserList(currentPage);
    },

    // 跳转页面
    view(id) {
      this.$router.push("/dashboard/user/" + id);
    },

    // 新增用户弹窗按钮
    add() {
      this.userQuery = {};
      this.addDialogVisible = true;
    },

    // 编辑用户弹窗按钮
    edit(id) {
      this.editDialogVisible = true;
      // 查询需要编辑的用户信息
      this.loadUser(id);
    },

    // 删除用户按钮
    del(id) {
      messagePrompt("您确定删除该用户信息？").then(() => {
        // 发送删除请求
        doDelete("/api/user/deleteUser", {id}).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("删除成功！", "success");
            // 刷新页面
            this.reload();
          } else {
            messageTitle("删除失败！异常原因：" + resp.data.msg, "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
    },

    // 批量删除
    batchDel() {
      if (this.userIdArray <= 0) {
        messageTitle("请选择要删除的用户记录", "warning");
        return;
      }
      let ids = this.userIdArray.join(",");
      messagePrompt("您确定批量删除用户信息？").then(() => {
        // 发送删除请求
        doDelete("/api/user/batchDeleteUser", {ids}).then(resp => {
          if (resp.data.code === 0) {
            messageTitle("批量删除成功！", "success");
            // 刷新页面
            this.reload();
          } else {
            messageTitle("批量删除失败！异常原因：" + resp.data.msg, "error");
          }
        })
      }).catch(() => {
        messageTitle("取消删除！", "warning");
      })
    },

    // 加载编辑用户信息
    loadUser(id) {
      doGet("/api/user/userDetailInfo", {id}).then(resp => {
        if (resp.data.code === 0) {
          this.userQuery = resp.data.data;
          this.userQuery.loginPwd = "";
          console.log(this.userQuery);
        }
      })
    },

    // 提交新增用户信息
    addUserSubmit() {
      let formData = new FormData();
      for(let field in this.userQuery) {
        formData.append(field, this.userQuery[field]);
      }
      this.$refs.addUserFormRef.validate(isValidate => {
        if (isValidate) {
          doPost("/api/user/userSave", formData).then(resp => {
            if (resp.data.code === 0) {
              messageTitle("新增用户成功！", "success");
              // 刷新页面
              this.reload();
            } else {
              messageTitle("新增用户失败！", "warning");
            }
          })
        }
      })
    },

    // 提交修改用户信息
    editUserSubmit() {
      let formData = new FormData();
      for (let field in this.userQuery) {
        formData.append(field, this.userQuery[field]);
      }
      this.$refs.editUserFormRef.validate(isValidate => {
        if (isValidate) {
          doPut("/api/user/editUserInfo", {formData}).then(resp => {
            if (resp.data.code === 0) {
              messageTitle("编辑用户成功！", "success");
              // 刷新页面
              this.reload();
            } else {
              messageTitle("编辑用户失败！", "warning");
            }
          })
        }
      })
    }

  }


}
</script>

<style scoped>
  .el-pagination {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 15px;
  }
  .el-from{
    width: 60%;
    margin: auto;
  }
  .el-select{

  }
</style>