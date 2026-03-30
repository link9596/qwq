---
layout: post
title: 又爆改了亿点点
tag: skill
---

抽空又改了一下这个小破站，为什么嘞，是因为Leancloud又搞事情了 ~~(要关服了 悲)~~，我的评论系统又没着落了

之前一直是用的Valine+Leancloud来实现的评论系统，好处是非常方便，用Leancloud作为后端管理也非常方便，Valine这边呢也只需要写几行配置就能跑起来了，不过也有一些缺点，就是貌似Valine对Pjax的支持不太友好，我折腾了很久都没能让Valine完美兼容Pjax，我觉得有Pjax还是很重要的，但如果没评论区又会显得网站很无聊，只能舍弃Pjax了。

Leancloud向普通用户提供开发版应用，完全免费，其实当时选择这个评论方案还是有点顾虑的，~~因为免费的才是最贵的 说不定哪一天就转为收费或者跑路了~~，但想着Leancloud好歹也是知名提供商，跑路其实不太可能，最不济最后转为收费后在考虑购买或者选择其他方案嘛。

但最近在登陆leancloud管理后台的时候，突然看到了官方发布的[停止服务通知](https://docs.leancloud.app/sdk/announcements/sunset-announcement/)，一开始以为只是停止一些其他无关紧要的服务，但当我一点进去看的时候...我操，真他妈要停服了啊![](https://atlinker.cn/exp/sweat.gif)

Valine作为后端完全依赖Leancloud的评论系统，Leancloud停服意味着Valine像是离开水的鱼...活不了一点

这一天还是来了，Waline启动！

![](https://s41.ax1x.com/2026/03/30/pe3dnxS.png)

Waline是基于Valine衍生的带后端评论系统。可以将 Waline 等价成 With backend Valine。新版本Waline比Valine功能更多，还对Pjax更友好，但是数据迁移过程中，还是有好多坑，Valine创建的数据库内容和Waline有一点点不一样，导入的时候转换这些就花了好久时间。花了两天终于把数据迁移过来了，感觉有后端还是方便些。再花半天搞了Waline和Instantclick的适配，终于实现无刷新了，终于感觉速度飞起来了

![](/exp/new/a14.gif)
