<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <article-list @showAction="openMoreAction" :channel_id="channel.id" ></article-list>
      </van-tab>
      <!-- 显示编辑频道得图标 -->
    </van-tabs>
    <span class="bar_btn"  @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹窗组件 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action @dislike="dislikeOrReport($event,'dislike')" @report="dislikeOrReport($event,'report')"></more-action>
    </van-popup>
    <!-- 编辑频道 -->
    <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <!-- 放置频道 -->
      <channel-edit></channel-edit>
 </van-action-sheet><channel-edit v-model="showChannelEdit"></channel-edit>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
import MoreAction from './components/more-action'
import { disLikeArticle, reportArticle } from '@/api/article'
import eventBus from '@/utils/eventBus'
import channelEdit from './components/channel-edit'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认启动第0个标签
      channels: [], // 用作接收频道
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null, // 定义一个值接收
      showChannelEdit: false // 设置频道编辑一开始不显示
    }
  },
  components: {
    ArticleList,
    MoreAction,
    channelEdit
  },
  methods: {
    async getMyChannels () {
      // 获取频道列表
      let data = await getMyChannels()
      this.channels = data.channels // 将data里面的方法里面的channles赋值给网页
    },
    // 监听子组件触发事件，打开弹窗
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    // 不喜欢文章或者举报文章
    async dislikeOrReport (params, operatetype) {
      try {
        if (this.articleId) {
          operatetype === 'dislike'
            ? await disLikeArticle({
              target: this.articleId
            }) : await reportArticle({
              target: this.articleId,
              type: params
            })
          this.$gnotify({ type: 'success', message: '操作成功' })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.showMoreAction = false
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '操作失败' })
      }
    }
  },
  // 在生命周期created中调用该方法
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 编辑频道面板得样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
