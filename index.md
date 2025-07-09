---
layout: default
title: ""
permalink: /
---

![](assets/banner-1557881_1280.jpg){: height="100px" width="100%"}

# Posts
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> <small>({{ post.date | date: "%d.%m.%Y" }})</small>
    </li>
  {% endfor %}
</ul>