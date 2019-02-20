---
layout: post
title: Hydrogen主题发布
tags: Hydrogen
stickie: true
---

不咕了，昨晚猿宵节(程序猿通宵肝代码的节日)肝了一晚上总算把主题写完了233

~~之前自己挖的坑得填~~

## #Hydrogen

她是一个简洁有力的Jekyll主题

:point_right:[项目地址](https://github.com/link9596/hydrogen)

![主题预览](/usrimg/2019-2-20-theme-1.png)

接触过静态博客的dalao都知道，经营一个静态博客是个技术活~

>　**Hydrogen**将**Liquid**物尽其用，将主题配置项尽可能地简化，只需要修改几个简单的配置文件，就能轻松让你的博客跑起来，带给你纯粹的写作体验

### #自适应

> 无论在你的iPhone或者是ipad、iMac上浏览主题，她都能够将最完美的排版渲染好呈现在你的面前

![iphone](/usrimg/2019-2-20-theme-2.png)

## #竭尽全力

Hydrogen是我倾注许多心血打造的主题，如果您喜欢\~您的Star将是对我的认可~:+1:

<iframe src="https://ghbtns.com/github-btn.html?user=link9596&repo=hydrogen&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>

您的赞助将是我工作的动力~:relaxed:

> 捐助者将写入支持者名单~谢谢大家支持~:laughing:

<table style="width：100%;table-layout:fixed;word-wrap:break-word;">
  <tr>
    <th width="10%">捐助人</th>
    <th width="10%">金额</th>
    <th align="center" width="20%">时间</th>
    <th width="20%">备注</th>
  </tr>
 {% for d in site.data.donate %}
{% capture allmoney = 0 %}{{ allmoney | plus: d.money }}{% endcapture %}
  <tr>
    <td> {{ d.name }} </td>
    <td> {{ d.money }} </td>
    <td align="center"> {{ d.time }} </td>
    <td> {{ d.remark }} </td>
  </tr>
 {% endfor %}<p><b>总金额： <span style="color:#E91E63">{{ allmoney }}</span> 元</b></p>
</table>

![wechat](https://atlinker.cn/pay/wechat.png)

![pay](https://atlinker.cn/pay/apay.png)
