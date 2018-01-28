---
layout: page
title: Links
tagline: My friends.
permalink: /links.html
---

{% for f in site.data.friends %}
<div class="link-chip">
 <img src="{{f.image}}" class="link-chip-icon">
 <a target="_blank" class="link-chip-title" href="{{f.url}}">{{f.name}}</a>
</div>
{% endfor %}
<div class="link-chip">
<img src="http://emlog.club/logo.jpg" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://emlog.club/">友链博客</a>
</div>

<div class="link-chip">
<img src="http://www.huisai.top/usr/files/icon.jpg" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://www.huisai.top">蟋蟀程序员</a>
</div>

<div class="link-chip">
<img src="http://www.molerose.com/usr/themes/molerose/images/400-400.jpg" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://www.molerose.com/">Molerose</a>
</div>

<div class="link-chip">
<img src=" https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1514795263&di=fe0250bafa079e945203fbf61684a4c9&src=http://cdnimg103.lizhi.fm/audio_cover/2014/11/22/16021180753166727_320x320.jpg" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://www.qiuxiaodu.club/">仇小杜Blog</a>
</div>

<div class="link-chip">
<img src="/avatar/default.png" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="https://ogays.club">共享评测</a>
</div>

<div class="link-chip">
<img src="http://0.gravatar.com/avatar/c3441ce2d52103994bf68f221b331707?s=64&d=mm&r=g" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://blog.whoit.top/">dyt5AAUI</a>
</div>

<div class="link-chip">
<img src="http://www.ashite.com/favicon.ico" class="link-chip-icon">
<a target="_blank" class="link-chip-title" href="http://www.ashite.com/">凌独小棧</a>
</div>

[返回主页]({{ site.url }}{{ site.baseurl }})
