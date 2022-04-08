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

### #目前不接受除好基友以外新开站点（文章数少于15篇），不太接受熟人外的友链申请（当然你可以多互动混个眼熟~），或许你也可以直接发起py邀请（或许我对内容特别感兴趣捏，嘻嘻）

(* /ω＼*)

{% for f in site.data.friends %}
<div class="link-chip">
 <img alt="{{f.describe}}" src="{{f.image}}" class="link-chip-icon">
 <a title="{{f.describe}}" target="_blank" class="link-chip-title" href="{{f.url}}">{{f.name}}</a>
</div>
{% endfor %}

[返回主页]({{ site.url }}{{ site.baseurl }})

<hr/>

  {% if site.data.social.valine_comment.enable  == true %}
  <script src="/comment/av-min.js"></script>
  <script src="/comment/valine.js"></script>
  <div id="comments"></div>
  {% include comments.html %}
  {% include emoji.html %}
  {% endif %}
  {% include scripts.html %}
