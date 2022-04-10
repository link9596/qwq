---
layout: post
title: 关于Valine无法读取Leancloud评论数据的解决方案
tags: skill
---

前不久Leancloud搞事情，导致好多用Valine评论插件的xdm都无法读取评论列表了，都出现了`Code:-1`，想~~(鸽)~~了好久终于找到了解决方法...

前几周一直被这个评论问题困扰了好久，因为近期我都没动过博客源码，而问题突然出现肯定是Leancloud出了问题，我以为是某个节点无法访问了，想必Leancloud过几天应该会自行恢复吧，然后......就~~咕咕咕~~

然鹅到了今天，评论还是没有恢复，仍然报错

```
Code -1: Request has been terminated
Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.
```

好吧，该排查一下是哪里的问题了

按照国际惯例，我们摁一下F12

![F12](/usrimg/2022-4-9-lcloud2.png)

果然看到个报错是`api.lncld.net`链接被拒绝了，难道这个接口行不通了？

去官网看看文档，果然在新闻页看到了一则关于接口更新的通知

[国际版域名 us-api.leancloud.cn 已下线，使用旧版 SDK 需进行版本升级](https://forum.leancloud.cn/t/us-api-leancloud-cn-sdk/24951)

但文中只写到了国际域名的更新，而我一直用的国内版本，往下翻也没看到国内版的更新通告，有没有可能国内版也更新了呢？

于是我决定去瞄一眼

![国内域名](/usrimg/2022-4-9-lcloud3.png)

果然给我换了...

而那个旧接口`api.lncld.net`，我记得在我安装插件的时候没有写过这个地址，所以推测应该在av-min.js里写死了，打开av-min.js搜索一下这个地址

![旧接口](/usrimg/2022-4-9-lcloud1.png)

搜到了，旁边还有国际接口的地址，把它替换成新的试试，马上就能正常读取了。

所以解决方案就出来了:

> 1. 前往Leancloud后台，在`设置`>`应用凭证`里找到`服务器地址
(REST API 服务器地址)`
>
> 2. F12看被阻止的旧api地址
>
> 3. 在av-min.js里将其替换

大功告成。

另外在github里我看到了开发人员也注意到了这个问题，所以他们更新了`av-min.js`文件，这样一来用新版Valine的hxd应该不会出现这个问题，用老款的hxd可以用这个方案解决。