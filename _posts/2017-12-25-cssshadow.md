---
layout: post
tags: Skill
title: 用css的blur属性生成阴影
---

通常而言，我们生成阴影的方式大多是`box-shadow` 、`filter: drop-shadow()` 、`text-shadow` 。但是，使用它们生成阴影是阴影只能是单色的。

有同学会问了，你这么说，难道还可以生成渐变色的阴影不成？

![无比期待的眼神.png][1]

额，当然不行。

![不行也得行.png][2]

这个真不行，但是通过巧妙的利用 filter: blur 模糊滤镜，我们可以假装生成渐变色或者说是颜色丰富的阴影效果。

假设我们有下述这样一张头像图片：

![头像1][3]

下面就利用滤镜，给它添加一层与原图颜色相仿的阴影效果，核心 CSS 代码如下：

```css
.avator {
    position: relative;
    background: url(/avators.png) no-repeat center center;
    background-size: 100% 100%;
    
    &::after {
        content: "";
        position: absolute;
        top: 10%;
        width: 100%;
        height: 100%;
        background: inherit;
        background-size: 100% 100%;
        filter: blur(10px) brightness(80%) opacity(.8);
        z-index: -1;
    }
}
```

看看效果：

![头像2][4]

其简单的原理就是，利用伪元素，生成一个与原图一样大小的新图叠加在原图之下，然后利用滤镜模糊`filter: blur()`配合其他的亮度/对比度，透明度等滤镜，制作出一个虚幻的影子，伪装成原图的阴影效果。

嗯，最重要的就是这一句`filter: blur(10px) brightness(80%) opacity(.8); `。

[1]: https://atlinker.cn/usrimg/2017-12-24-1.png
[2]: https://atlinker.cn/usrimg/2017-12-24-2.png
[3]: https://atlinker.cn/usrimg/2017-12-24-3.png
[4]: https://atlinker.cn/usrimg/2017-12-24-4.png
