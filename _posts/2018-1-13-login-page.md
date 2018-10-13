---
layout: post
title: Material Design表单组件
tag: Skill
---

看哪！我们发现了一些一颗赛艇的Material Design组件！想要占有它并开始使用它？那就快过来抓住它吧！:smirk:

## #获取
[You can catch it here](http://admin.atlinker.cn/css/styles.css)

在这篇文章中，你会看到：

### #CSS
> `Material Design 输入框`

> `Material Design 浮动按钮`

### #JavaScript
> `JS无需后端实现密码登陆 [Beta!]`

## #Input框

这个看了一下谷歌的官方MD设计文档，倒挺简单，主要就是输入框在focus状态下的动画，可以用translateY配合字体大小的变换实现，这里只举了一个类作例子：
```css
.form-group .form-control:focus + .form-label, .form-group .form-control:valid + .form-label {
  font-size: 12px;/*点击后字体变小*/
  -ms-transform: translateY(-20px);/*文本向上移*/
  -webkit-transform: translateY(-20px);
  transform: translateY(-20px);
  color: #E91E63;
}
```

使用时新建一个含有`form-group`类的容器，将输入框加上`form-control`，提示文字加上`form-label`类即可赋予样式

使用实例：
```html
<div class="form-group">
    <form id="form1" name="form1" method="post" action="" >
        <input type="text" name="username" class="form-control" required="required"/>
        <label class="form-label">用户名</label>
    </form>
</div>
```

## #浮动按钮

这个需要注意按钮的阴影，这里可能与平时设置的阴影值不大一样，还有就是按钮的浮动效果：
```css
.link-button{
  min-width: 88px;
  padding: 0px 16px;
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  line-height: 36px;
  border-radius: 3px;
  border: none;
  background: #E91E63;
  color: #fff;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
  -webkit-transition: all .5s cubic-bezier(.4, 0, .2, 1), box-shadow .2s cubic-bezier(.4, 0, 1, 1);
  transition: all .5s cubic-bezier(.4, 0, .2, 1), box-shadow .2s cubic-bezier(.4, 0, 1, 1);
  outline: none;
}

.link-button:hover {
/*浮动阴影变化*/
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
}
```

使用时为元素加上`link-button`类即可拥有浮动按钮样式

使用实例：
```html
<input class="link-button" type="button" name="login" value="登入" onclick="check();"/>
```


UI已经弄得差不多了，要做一个密码登陆功能进行测试，为了方便就直接用Javascript写，需要用JS监听输入框输入的内容并判断，如果两个框输入的结果都与设定的一致，则跳转到指定网页，如果不一致，则弹窗：
```javascript
function check(){
 var user = "link", password = "95969639";
 var temUser = document.form1.username.value;
 var temPassword = document.form1.password.value;
 if(user==temUser && password==temPassword)
{
window.location.href="http://lkopp.ml";
}
 else{
   alert("用户名或密码错误!");
  }
}
```
注意！此JS登陆功能仅作测试或玩耍用

[页面演示](https://admin.atlinker.cn)
