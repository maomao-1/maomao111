// 用于文章数据的获取
import request from '@/utils/request'
/**
 * 获取推荐文章的数据
 * axios中query参数放置在params上
 * body参数放置在data上 */

export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
/***
 * 不喜欢文章接口
 * ***/
export function disLikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}

/** **封装一个举报文章的API*****/
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
/***
 *获取文章搜索的建议
 * **/
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
/****
 * 获取文章搜索的结果
 * params是get参数
 * data是body参数
 * ***/
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
