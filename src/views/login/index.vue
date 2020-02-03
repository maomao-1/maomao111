<template>
  <div class="container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model="loginForm.mobile"
        required
        label="手机号:"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        @blur="checkCode"
        :error-message="errMsg.code"
        v-model="loginForm.code"
        required
        label="验证码:"
        placeholder="请输入验证码"
      >
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="sss"></div>
    <van-button type="info" size="mini" block round @click="logina">登录</van-button>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },

  methods: {
    checkMobile () {
      // 判断是否为空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      }
      // 判断格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机格式不正确'
        return false
      }
      this.errMsg.mobile = '' // 清空信息
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码必须为6位数字'
        return false
      }
      this.errMsg.code = '' // 清空信息
      return true
    },
    async logina () {
      if (this.checkMobile() && this.checkCode()) {
        const data = await login(this.loginForm) // 获取接口结果
        this.updateUser({ user: data }) // 更新用户信息
        // 登录成功
        this.$notify({ type: 'success', message: '登录成功' })
        // 跳转
        // 两种情况 1 redirectUrl (登录未遂 => 登录  => 遂) 2 没有 redirectUrl 跳到首页
        let { redirectUrl } = this.$route.query // 解构当前的路由信息
        this.$router.push(redirectUrl || '/') // 短路表达式
      }
    },
    ...mapMutations(['updateUser'])
  }
}
</script>

<style scoped>
.sss {
  padding: 10px;
}
</style>
