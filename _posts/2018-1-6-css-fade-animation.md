---
layout: post
title: css3动画之页面滑入效果
tags: Skill
---

一直想往博客上加一个页面加载的“淡入+滑入”效果，于是去SegmentFault上找了一些，发现他们都是用Jquery动画实现的，emmm...这种简单动画咱就别依赖第三方框架了吧:flushed:，于是乎决定自己写一个。

为什么我不想用JQ，因为JQ库大小达到了260+KB，引用后肯定会影响加载速度，除非用异步加载，熟悉原生JS的话可以用直接用JS写这可是极好的：

```javascript
var body=document.getElementsByTagName('body')[0];
for(var i=0;i<100;i++){
 var a=0;
 var t=setTimeout("body.style.opacity=a/100;a++;",i*5);
}
```

css3`animation`
