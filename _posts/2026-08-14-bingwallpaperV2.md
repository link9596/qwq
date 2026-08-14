---
layout: post
title: 获取必应每日壁纸
tags: Skill
---

之前做过一个这样的api来绕过跨域，可以获取必应搜索主页的背景图，每天都会自动轮换，挺有意思的，不过之前用来代理的服务器现在速度不太行了，故移植到了新服务器上，做成了v2版本

## #必应壁纸 API v2 使用指南

- **API 地址**：[https://bing.lkin.cn/](https://bing.lkin.cn/)
- **所有接口均支持跨域（CORS）**
- 默认返回国内版数据，支持添加 `region=cn` 参数来切换国内版
- 国内版：[https://bing.lkin.cn/?region=cn](https://bing.lkin.cn/?region=cn)

---

## #获取壁纸图片

### 默认尺寸（1920×1080）

> GET [https://bing.lkin.cn/wallpaper](https://bing.lkin.cn/wallpaper)

```html
<img src="https://bing.lkin.cn/wallpaper" alt="每日壁纸">
```

### 1366分辨率（1366×768）

通过拼接参数`r=1366`来获取分辨率为1366×768的壁纸

> GET [https://bing.lkin.cn/wallpaper?r=1366](https://bing.lkin.cn/wallpaper?r=1366)

不传或传其他值 → 默认 1920×1080

### 图片跨域代理模式

当获取壁纸图片时，默认行为是 302 重定向到必应的图片网址，图片本身可能不支持跨域。这样的好处是图片加载更快，并且浏览器对带src属性的标签没有严格的跨域政策。

但如果你想在JS里处理这张图片，比如绘制到 Canvas 等等就需要这张图片能够允许跨域

接口提供了 `cors` 参数用于请求跨域代理的图片，来允许 JS `fetch` 处理或其他必须要求跨域的场景，请加上 `cors=true` 参数来获取允许跨域的图片

GET [https://bing.lkin.cn/wallpaper?cors=true](https://bing.lkin.cn/wallpaper?cors=true)

返回的图片会带上允许跨域的头，但会拖慢加载速度，因为图片要先从Bing下载到我的服务器，再二次分发

支持`region=cn`参数切换国内版本，如：[https://bing.lkin.cn/wallpaper?cors=true&region=cn](https://bing.lkin.cn/wallpaper?cors=true&region=cn)

## #获取JSON源数据

使用API 根地址：[https://bing.lkin.cn/](https://bing.lkin.cn/)来返回允许跨域的JSON源数据

数据格式：

```json
{
    "images": [
        {
            "startdate": "20190728", 
            "fullstartdate": "201907280700", 
            "enddate": "20190729", 
            "url": "/th?id=OHR.NebraskaCarArt_EN-US3283375378_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp", 
            "urlbase": "/th?id=OHR.NebraskaCarArt_EN-US3283375378", 
            "copyright": "Carhenge, created by Jim Reinders near Alliance, Nebraska (© Charlie Summers/Minden Pictures)", 
            "copyrightlink": "https://www.bing.com/search?q=carhenge&form=hpcapt&filters=HpDate%3a%2220190728_0700%22", 
            "title": "Kitsch collides with archaeology at Carhenge", 
            "quiz": "/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190728_NebraskaCarArt%22&FORM=HPQUIZ", 
            "wp": false, 
            "hsh": "bd9468a81db78217711eb758046ba487", 
            "drk": 1, 
            "top": 1, 
            "bot": 1, 
            "hs": [ ]
        }
    ], 
    "tooltips": {
        "loading": "Loading...", 
        "previous": "Previous image", 
        "next": "Next image", 
        "walle": "This image is not available to download as wallpaper.", 
        "walls": "Download this image. Use of this image is restricted to wallpaper only."
    }
}
```

你也可以加上参数来获取`q=copyright` `q=copyrightlink` `q=title`三个值(参数对国内国际两个版本都通用)

参数 | return(纯文本) |  示例
-|-|-
q=copyright | 图片版权 | https://bing.lkin.cn/?q=copyright |
q=copyrightlink | 版权链接 | https://bing.lkin.cn/?q=copyrightlink |
q=title | 图片标题 |https://bing.lkin.cn/?q=title |

示例：

获取国内版版权文本：/?q=copyright&region=cn

> 如有接口连接问题请及时留言
