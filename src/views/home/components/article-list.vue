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
        <van-cell v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!--  单图模式 -->
            <div class="img_box" v-else-if="article.cover.type === 1">
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}</span>
              <span>{{article.pubdate | relTime }}</span>
              <!-- 判断是否显示查号 -->
              <!-- 点击叉号，要告诉父组件 我要反馈 -->
              <span class="close"  v-if="user.token" @click="$emit('showAction',article.art_id.toString())">
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
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      articles: [], // 定义一个数组，来接收加载得数据
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
  created () {
    // 开启监听
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        // 这个条件表示 该列表就是当前激活的列表
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId) // 查找对应的文章
        // 如果index大于 -1 表示找到了 就要删除
        if (index > -1) {
          this.articles.splice(index, 1) // 删除不喜欢的文章
        }
      }
    })
  },
  // 映射vuex中得store对象到计算属性上
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 上拉加载方法
    async onLoad () {
      await this.$sleep() // 等待时间
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
      this.articles.push(...data.results)
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
    async onRefresh () {
      await this.$sleep()
      // setTimeout(() => {
      //   let arr = Array.from(Array(10), (value, index) => '爱情' + (index + 1))
      //   this.list.unshift(...arr) // 将数据添加到队首
      //   this.isLoading = false // 关掉下拉状态
      //   this.xx = `更新了${arr.length}条数据`
      // }, 1000)
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.isLoading = false // 关掉下拉状态
      // 有可能 最新没有推荐数据
      if (data.results.length) {
        // 如果长度大于0 表示有数据
        this.articles = data.results // 将历史数据全都覆盖掉了
        // 假如你之前 已经将 上拉加载设置成finished设置成true了
        // 表示 我们还需要继续往下拉 就需要把原来的状态再次打开
        this.finished = false
        // 注意我们依然需要获取此次的历史事件戳
        this.timestamp = data.pre_timestamp // 赋值历史时间戳 因为当你下拉刷新之后 上拉加载的时候 要用到这个历史事件戳
        this.xx = `更新了${data.results.length}条数据`
      } else {
      //  如果没有数据更新  什么都不需要变化
        this.xx = '已是最新数据'
      }
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
