<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="xx">
      <van-list
        v-model="upLoading"
        :finished="finished"
        finished-text="傻逼陈金凤，到底了别刷新了"
        @load="onLoad"
      >
        <!-- v-for 渲染数据 -->
        <van-cell v-for="lists in list" :key="lists.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ lists.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="lists.cover.type === 3">
              <van-image class="w33" fit="cover" src="lists.cover.images[0]" />
              <van-image class="w33" fit="cover" src="lists.cover.images[1]" />
              <van-image class="w33" fit="cover" src="lists.cover.images[2]" />
            </div>
            <!--  单图模式 -->
            <div class="img_box" v-else-if="lists.cover.type === 1">
              <van-image class="w100" fit="cover" src="lists.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{lists.aut_name}}</span>
              <span>{{lists.comm_count}}</span>
              <span>{{lists.pubdate}}</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      list: [], // 定义一个数组，来接收加载得数据
      isLoading: false, // 是否开启下拉刷新
      xx: '', // 下拉成功显示得文本
      timestamp: null // 定义一个时间戳 这个时间戳用来告诉服务器 现在我要求什么样的时间戳
    }
  },
  props: {
    channel_id: {
      type: Number, // 指定要传的props类型
      required: true, // 要求props必须传
      default: null // 给props的一个默认值。如果required为true，这就填null
    }
  },
  methods: {
    // 上拉加载方法
    async onLoad () {
      // setTimeout(() => {
      //   if (this.list.length < 50) {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => index + this.list.length + 1
      //     )
      //     this.list.push(...arr) // 把生成的数据追加到末尾
      //     this.upLoading = false // 关闭状态
      //   } else {
      //     // 停止追加
      //     this.finished = true
      //   }
      // }, 1000)
      let data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      // 追加数据到队尾
      this.list.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      if (data.pre_timestamp) {
        // 如果有
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true // 没有数据了
      }
    },
    // 下拉加载方法
    onRefresh () {
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => '爱情' + (index + 1))
        this.list.unshift(...arr) // 将数据添加到队首
        this.isLoading = false // 关掉下拉状态
        this.xx = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
