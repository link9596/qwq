---
layout: post
title: 捕捉响应头里的时间戳
tags: Skill
---

Javascript获取当前时间戳有三种方法，有两种可以精确到毫秒，另外一种可以精确到秒，具体如下

```javascript
var timestamp = Date.parse(new Date());
//精确到秒
//输出为1517457493000
```

```javascript
var timestamp = (new Date()).valueOf();
//精确到毫秒
//输出为1517457493101
```

```javascript
var timestamp = new Date().getTime();
//精确到毫秒
//输出为1517457493101
```

#### 嘘，都别忘了，单单这样获取的时间戳可不是网络上的时间戳！

什么意思呢？就举个栗子~这里先定义一个“标准时间”

> 当标准时间为
> 2018-02-01 00:00:00
>
> 此时的时间戳为：1517414401000

分别运行上方三个函数，并输出，得到的三个结果都是`1517414401000`，嗯，没错这与标准时间相同，**可是**，此时用户修改了时间，返回的结果就不是以上的“标准时间”了

也就是说，这种方法获取的是用户系统上时间戳，当用户的系统时间不对，输出的结果也跟随着跑掉了，假如我们要做一个“站点建立时间”，这种方法显然是行不通的。

## #怎么避免

这个简单，只需要获取网络上的时间戳就行了。

![期待无比的眼神.png](http://atlinker.cn/usrimg/2017-12-24-1.png)

可到哪里获取网络时间戳捏？又得找一个api吗？ (逃。。。

完全不用，浏览器向服务器发起请求的时候，有一个响应头，里面就藏着我们想要的东西嘿嘿:sunglasses:

以下就以添加博客建立天数为栗子 = =

## #获取

Ajax是个好东西

新建一个Ajax请求，把响应头里的时间戳抓过来：

```javascript
ajax()
  function ajax(option){
    var xhr = null;
    if(window.XMLHttpRequest){
      xhr = new window.XMLHttpRequest();
    }else{ // 兼容ie
      xhr = new ActiveObject("Microsoft")
    }
    xhr.open("get","location.href");
    xhr.send(null);
    xhr.onreadystatechange = function(){
      var time = null,
          curDate = null;
      if(xhr.readyState===2){
        // 获取时间戳
        time = xhr.getResponseHeader("Date");
        console.log(xhr.getAllResponseHeaders())
        curDate = new Date(time);
      }
    }
  }
```

## #输出

数据已经抓过来了，尝试输出：

```javascript
alert(curDate.getTime());
```

> 输出结果为：
>
> 1517414401000

所以这种方法获取到了秒级时间戳，上面的时间戳多了三个我们用不到的"0"，所以除去1000消去三个0

```javascript
alert( (curDate.getTime() / 1000 ) );
```

回想我们博客建立时的时间，转换成时间戳，然后用获取到的时间戳减去博客建立时的时间戳，再除去一天的秒数(86400秒)，得到已经建立的天数：

```javascript
alert( (((curDate.getTime() / 1000) - 1514020000 ) / 86400 )) );
//其中1514020000是我的建立时间戳
```

得到的结果肯定是小数，我们只需`parseInt()`取整即可；

```javascript
alert( parseInt((((curDate.getTime() / 1000) - 1514020000 ) / 86400 )) );
```

获取到的数据也可以不用以时间戳的形式输出：

```javascript
alert( curDate.getFullYear() );
//当前所在年份

alert( curDate.getMonth() );
//当前所在月份

alert( curDate.getDate() );
//天数

alert( curDate.getHours() );
//小时

alert( curDate.getMinutes() );
//分钟

alert( curDate.getSeconds() );
//还有秒 = =
```

还有更多玩法等你探索呐:satisfied:
