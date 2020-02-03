<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text='xx'>
      <van-list v-model="upLoading" :finished="finished" finished-text="傻逼，到底了" @load="onLoad">
        <van-cell v-for="lists in list" :key="lists" :title="lists"></van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      list: [], // 定义一个数组，来接收加载得数据
      isLoading: false, // 是否开启下拉刷新
      xx: '' // 下拉成功显示得文本
    }
  },
  methods: {
    // 上拉加载方法
    onLoad () {
      setTimeout(() => {
        if (this.list.length < 50) {
          let arr = Array.from(
            Array(10),
            (value, index) => index + this.list.length + 1
          )
          this.list.push(...arr) // 把生成的数据追加到末尾
          this.upLoading = false // 关闭状态
        } else {
          // 停止追加
          this.finished = true
        }
      }, 1000)
    },
    // 下拉加载方法
    onRefresh () {
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => ('爱情' + (index + 1)))
        this.list.unshift(...arr) // 将数据添加到队首
        this.isLoading = false // 关掉下拉状态
        this.xx = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
