---
layout: post
title: 浅谈CSS中元素如何优雅地"消失"
tags: Skill
---

前几天重写导航栏菜单的时候，想给菜单加个动画，因为之前用的是`display`属性来控制隐藏和显示，但是这属性不支持CSS动画，要想支持css动画得用`opacity` `visibility`这俩了，可是用了这俩后发现有点小问题...![](/exp/sweat.gif)

## #出大问题

用了`opacity` `visibility`发现可以完美显示动画了，可是发现在手机上有部分区域无法点击了，起初我还以为手机屏幕出问题了，结果换了个手机那块区域还是无法点击，起初没注意到是菜单栏的问题，结果拿出电脑F12，发现内鬼竟然真的是菜单栏![](/exp/neutral.gif)

后来才晓得，`display`属性会把元素直接移除，而`opacity` `visibility`只是把元素变透明了，而实际占用的面积还在，并且该元素下方的区域也无法点击(相当于遮罩)

那让元素有动画的同时优雅地"消失"，只能和JS一起配套食用咯，在CSS动画结束后把元素设置为`display:none`或者把元素的长宽设置为0

下面就是菜单栏的实例(菜单栏使用复选框实现):
```javascript
window.onload=function(){
document.getElementById('fold').style.height='0px';//在打开页面时就把高度设置为0
}
function clean(){  document.getElementById('fold').style.height='0px';
}//将高度设置为0的函数

function checkit(isChecked){
 if(isChecked)
document.getElementById('fold').style.height='auto';//如果复选框勾选了就恢复高度
 else
  window.setTimeout(clean, 500);//否则在0.5秒的动画结束后执行clean函数将高度设为0
}
```

这样就能在拥有css动画的同时优雅的让元素从屏幕上滚开了![](/exp/redface.gif)
