---
layout: post
title: 使用Snackbar更优雅的通知
tags: Skill
---

一直很喜欢谷歌的Material Design设计规范，我觉得非常规整，互动感强又不花哨，当安卓5.0推出MD设计语言之后特别喜欢当时根据MD规范设计的一些App，比如b站、酷安等，但是碍于国内软件生态最后还是没能推广开来...

但不得不说Material Design确实是非常出色的设计语言，在交互方面非常高效，我也喜欢很多Material Design元素，尤其特别喜欢Snackbar，相比较安卓5之前的Toast来说，Snackbar可交互，在显示一些短通知方面更加高效。

在MDUI的官网有Material Design的[设计规范中文文档](https://www.mdui.org/zh-cn/design/1/)

![](https://s41.ax1x.com/2026/04/04/petUgx0.webp)

而通过历代更新，Snackbar的样式也有了许多微小变化

然后就有了这个：[Snackbar组件](https://github.com/link9596/Snackbar)

仅需5kb就可以优雅地使用Sanckbar进行通知~

你可以在codepen.io查看 [Snackbar Demo](https://codepen.io/link9596/pen/myrKjdg)

## 使用说明

在 HTML 中通过 ```<script src=".../snackbar.js"></script>``` 引入。

## 参数说明：

| 参数 | 说明 |
| ---- | ---- |
| message (string) | 必填，提示文本 |
| actionText (string) | 可选，按钮文字 |
| actionHandler (function) | 可选，按钮点击的回调函数 |
| duration (number) | 自动收回延迟（毫秒），默认 3500，设为 0 则不自动关闭（常驻通知，必须通过交互等方式关闭） |

## 调用方式：


基础消息: snackbar.show({ message: '操作成功', duration: 3000 })

带操作按钮: snackbar.show({ message: '已删除', actionText: '撤销', actionHandler: () => { ```这里写回调函数``` } })

快捷调用: snackbar.info('纯文本消息') 或 snackbar.action('消息', '按钮', callback)
