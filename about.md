---
layout: page
title: about
tagline: 关于我 ~
sitetime: display
permalink: /about.html
---

# 时光窗

「Link」起源于: 2017年12月23日

如今已稳如老狗地运行<span id="sitetime2"></span>天

## #Catch me

你可以通过以下方式找到我

QQ: 1316341442

Email: <a href="mailto:lk@atlinker.cn">lk@atlinker.cn</a>

Github: [link9596](https://github.com/link9596)

摄影相册: [菲林小铺](https://film.atlinker.cn)

## #关于本站

本站使用主题: Hydrogen

由**Link Panel**强力驱动.(手动滑稽)![手动滑稽](/exp/funny.png)


很远的地方有一台冰冷的机器

储存着一个渺小人类渺小的热情

想有块属于自己的小地方储放自己的东西

即使来访的人很多 又或是人迹罕至

都没关系

我希望能一直运行下去

像风走了八千里，不问归期

## #捐助我

<center>扫下方付款二维码即可向我投喂!</center>

<img align="center" style="display:table-cell" src="https://atlinker.cn/pay/pay.png">

![wechat](https://atlinker.cn/pay/wechat.png)

![apay](https://atlinker.cn/pay/apay.png)

<table style="width：100%;table-layout:fixed;word-wrap:break-word;">
  <tr>
    <th width="10%">赞助人</th>
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

