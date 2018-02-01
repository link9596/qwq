---
layout: post
title: 捕捉响应头里的时间戳
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
