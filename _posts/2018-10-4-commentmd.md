---
layout: post
title: 评论框完美支持Markdown语法
tags: 瞎聊
---

想在评论时表达更多丰富的感情？欢迎使用Markdown语法给你的文字添加乐趣！

## #快速开始

如果你刚接触Markdown，这里有丰富的[Markdown语法指南](https://segmentfault.com/markdown)供你查阅

如果你曾接触过Markdown并且有少许了解，下面的**部分**Markdown语法可以帮助你快速进入状态

## #标题

文章内容较多时，可以用标题分段:

```markdown
标题1
======

标题2
-----

## 大标题 ##
### 小标题 ###
```

## #字体

```markdown
*斜体文本*    _斜体文本_

**粗体文本**    __粗体文本__

***粗斜体文本***    ___粗斜体文本___
```

## #链接
常用链接方法

```markdown
文字链接 [链接名称](http://链接网址)
网址链接 <http://链接网址>
```

### #高级链接技巧
```markdown
这个链接用 1 作为网址变量 [Google][1].

这个链接用 yahoo 作为网址变量 [Yahoo!][yahoo].
```
然后在文档的结尾为变量赋值（网址）
```markdown
  [1]: http://www.google.com/
  [yahoo]: http://www.yahoo.com/
```

## #插入图片

```markdown
![图片描述](https://图片链接)
```

## #拓展内容

你甚至可以在评论时添加表情#（手动滑稽）
```
![滑稽表情](/exp/funny.png)
显示效果如下
```
![](/exp/funny.png)
```
![滑稽表情](/exp/funnycry.png)
显示效果如下
```
![](/exp/funnycry.png)
```
![滑稽表情](/exp/funnyangry.png)
显示效果如下
```
![](/exp/funnyangry.png)

本站目前仅支持这几个表情，后续可能会添加，你们当然你也可以使用其他表情图片链接来玩耍
