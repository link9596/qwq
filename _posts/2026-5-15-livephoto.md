---
layout: post
title: 自己写一个实况照片网页组件？
tags: skill
---

因为苹果官方给的LivePhotoKit JS实在是台阶吧难用![](/exp/wry.gif)，于是乎自己动手写了一个...

![](https://files.atlinker.cn/img-151409-9760.png)

:point_right: [仓库地址](https://github.com/link9596/WebLivePhoto) :point_right: <a href="https://atlinker.cn/demo/livephoto.html" target="_blank">演示页</a>
<iframe src="https://ghbtns.com/github-btn.html?user=link9596&repo=WebLivePhoto&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>

起因是前几天在别人那里看到个很有意思的组件，可以在网页上放实况照片，而且体验和在ios上的实况照片几乎一致，上网搜了搜，发现苹果官方就给了LivePhotoKit JS这样的组件。

看了一下文档发现很简单，只要创建一个div在里面声明图片和视频的链接就可以生成实况照片了，于是在相册装了一个试试，开始前两天用着挺好的，可是后面用着用着发现很多问题，于是乎就自己写了一个Web.LivePhoto，不依赖官方库，对图片和视频的格式要求更宽松。

## 什么问题？

在用LivePhotoKit JS的时候经常会遇到实况照片无法播放的问题，很多错误的地方都很难找到原因，导致debug非常困难，而且实现的原理比较复杂，众所周知越复杂越容易出错，现在已知的错误有以下几种：

## 资源跨域

浏览器本身是允许img和video资源跨域的，但LivePhotoKit是使用XMLHttpRequest方法来加载视频和图片，再通过canvas绘制成一张图片，这样一来就会用js加载资源就会发生浏览器禁止跨域的问题，如果大家使用的是一些非正规图床，通常都是不允许跨域的，那这就会导致无法播放，修复起来又很麻烦。

## 视频格式

再一个就是LivePhotoKit在反复多次播放之后可能出现无法播放的问题，具体原因无法复现，而且出现频率不低，需要刷新页面后才能修复。对视频的格式要求很高，而且在请求视频时HTTP Content-Type返回的响应头需要是video/quicktime，否则也容易导致无法播放，编码必须为H.264编码（这个没得说，因为大部分浏览器不支持如H.265等其他编码），但是同样一个视频，通过ffmpeg转换出来的H.264视频可以播放，另一个软件转换出来的又不行，后面比对了两者的视频元数据，并没发现异常，我也不清楚是什么导致的无法播放，而且兼容性不太好，试过比如QQ自带的浏览器无法播放动态。

最开始想着看看LivePhotoKit的源码，看看为什么同样的H.264视频一个能播，另一个又不能播，可是看了源码发现，官方的实现实在是太复杂了，看的让人眼花缭乱，而且组件好像很久也没人维护了。

## ~~我chovy，你们做组件给我做好了呀~~

凭什么浏览器能放的视频，用这个组件又无法播放了？所以我决定放弃LivePhotoKit，决定自己写一个，以最简单的方式实现：一张图片和一个视频叠一起，长按让图片淡出，视频淡入，同时播放视频，结束后视频淡出图片淡入，于是就有了这个Web.LivePhoto组件。

因为本质上就是一张图片和一个视频叠在了一起，所以对视频的格式、图片尺寸、视频尺寸等等几乎没有什么要求，浏览器能看，就能用。并且没有跨域问题。动画和UI上都是像素级还原LivePhotoKit，毕竟果子这UI做的还是不错的。

为了方便大家修改来适配自己的网站样式，把CSS分开了，其实也没什么内容，不过肯定有人有想自定义样式的需求。

## 食用文档

### 安装
 
下载 `live-photo.css` 和 `live-photo.js` 文件，在页面中引入：

```html
<link rel="stylesheet" href="path/to/live-photo.css">
<script src="path/to/live-photo.js"></script>
```

以下是初始化方式，你当然可以自定义其他匹配规则：

## 初始化

默认方式

```html
<script>
    // 默认：自动扫描所有 .live-photo 容器并初始化
    LivePhoto.init();
</script>
```
```html
<script>
    // 指定选择器或元素，如查找所有id为myLivePhoto的元素
     LivePhoto.init('#myLivePhoto');
</script>
```

## 展示实况照片

展示！！以下方的html格式编写

```html
<div class="live-photo" id="myLivePhoto">
    <img class="live-photo-img" src="https://example.com/cover.jpg" alt="...">
    <video class="live-photo-video" playsinline muted preload="auto" poster="https://example.com/cover.jpg">
        <source src="https://example.com/video.mp4" type="video/mp4">
    </video>
</div>
```

当然还可以用简写成：

```html
<div class="live-photo" id="myLivePhoto">
    <img class="live-photo-img" src="https://example.com/cover.jpg" alt="...">
    <video class="live-photo-video" src="https://example.com/video.mp4" type="video/mp4" playsinline muted preload="auto"></video>
</div>
```

实际上就是一个div容器包裹了一张照片和一个视频，js会在默认情况下会自动寻找类名为live-photo的div容器，把类名为live-photo-img的图片和类名为live-photo-video的视频包装成实况照片。

目前在小米自带浏览器上会出现video标签被劫持的情况，具体表现是会破坏原有样式、显示出浏览器自带的播放控件（太流氓了），其他浏览器都正常显示~~（奇怪了劫持视频标签干嘛呀，不会是为了插播广告吧）~~

要破解只能使用fetch或XMLHttpRequest获取视频数据，转为Blob对象，再创建Blob URL赋给video标签，浏览器嗅探器就无法识别这类动态生成的 Blob URL，就不会被劫持了。但这样就不能跨域了，大家自己权衡吧= =，反正我觉得这类浏览器兼不兼容无所谓了![](/exp/razz.gif)..
