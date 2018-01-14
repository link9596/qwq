---
layout: post
title: css3动画之页面滑入效果
tags: Skill
---

一直想加一个页面加载的“淡入+滑入”效果，于是去SegmentFault上找了一些，发现他们都是用Jquery动画实现的，emmm...这种简单动画咱就别依赖第三方框架了吧:poop:，于是乎决定自己写一个。

为什么我不想用JQ，因为JQ库大小达到了260+KB:see_no_evil:，引用后肯定会影响加载速度，除非用异步加载，熟悉原生JS的话可以用直接用JS写这可是极好的：

```javascript
var body=document.getElementsByTagName('body')[0];
for(var i=0;i<100;i++){
 var a=0;
 var t=setTimeout("body.style.opacity=a/100;a++;",i*5);
} //这只实现了页面渐变效果，具体原因看下面
```

写到一半，我才记起来有css3有`animation`属性，实现起来代码似乎更少，因为现主流机器对css3的支持已经很好，JS动画也是通过改变css实现的，个人觉得，简单的动画还是用 CSS 做，特别复杂的再用 JS，于是弃坑了JS决定写css。

> 新建一个动画，命名为`fade-in`，`opacity`(不透明度)从`0~1`

>`translateY`(离Y轴的距离)从`30px~0px`，取正值从下方滑入，取负值从上方滑入

```css
@keyframes fade-in {
from {
  opacity: 0;
    transform: translateY(30px);
    }
to {
  opacity: 1;
    transform: translateY(0);
    }
}
```

动画基本制作完成，为了兼容移动端(例如Chrome和safari等)，需要再加一些东西
```css
@-webkit-keyframes fade-in {
  from {
  opacity: 0;
    -webkit-transform: translateY(30px);
      }
  to {
  opacity: 1;
    -webkit-transform: translateY(0);
     }
}
```
可以看到改变了一些小的地方，代码中加了`-webkit-`，就是为了兼容safari、chrome

为了使用这个动画，我们需要新写一个css类：
```css
.fade{
  -webkit-animation: fade-in 0.5s;
  animation: fade-in 0.5s;
}
```
然后把这三段代码封装到一个css文件内引用，然后为你的元素加上这个类以体验美妙的加载效果吧！:trollface:

[查看演示页面:trollface:](/demo/2018-1-6-fade-in.html)
