---
layout: page
title: Links
tagline: My friends.
permalink: /links.html
---

## #友链申请

可以在下方留言板评论即可申请本站友链! quq~

**格式**

> 名称: Link
>
> 链接: https://atlinker.cn
>
> 头像: https://atlinker.cn/avatar/avatar.png
>
> 描述: Just 4 Fun

本站的友链将按**时间顺序**排列

> 原则上不接受资源、广告、涉黄、违法、抄袭站点，其他无所谓~

### #请多来串门玩儿~

(* /ω＼*)

{% for f in site.data.friends %}
<div class="link-chip-div"><a href="{{f.url}}" target="_blank" class="link-chip ripple">
 <img alt="{{f.describe}}" src="{{f.image}}" class="link-chip-icon"/>
 <img style="filter:opacity(0.8);float:right;height:64px;margin-right:-8px" src="{{f.skin}}" />
 <span title="{{f.describe}}" class="link-chip-title">{{f.name}}</span>
 <p class="link-chip-dc">{{f.describe}}</p></a></div>
{% endfor %}

[返回主页]({{ site.url }}{{ site.baseurl }})

<hr/>

  {% if site.data.social.valine_comment.enable  == true %}
  <script src="/comment/av-min.js"></script>
  <script src="/comment/valine.js"></script>
  <div id="comments"></div>
  {% include new_comments.html %}
  {% endif %}
  {% include scripts.html %}
