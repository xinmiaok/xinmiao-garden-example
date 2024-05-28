---
UID: 20221108084354 
aliases: 列出包含摘要的笔记列表
tags: 
source: https://github.com/702573N/Obsidian-Notes-List
cssclass: 
created: "2022-11-08 08:43"
updated: "2022-11-08 09:10"
---

> 列出笔记列表，其中包含一小段文本摘录和缩略图
> 具体参考 ![[88-Template/script/notesList/README]]

## 正常视图

```dataviewjs
dv.view("notesList", {pages: '#book', view: "normal"})
```

## 兼容视图

```dataviewjs
dv.view("notesList", {pages: '"30-Reading"', view: "compact"})
```

## 卡片视图

```dataviewjs
dv.view("notesList", {pages: '"30-Reading"', view: "cards"})
```
