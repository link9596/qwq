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

[返回主页]({{ site.url }}{{ site.baseurl }})
