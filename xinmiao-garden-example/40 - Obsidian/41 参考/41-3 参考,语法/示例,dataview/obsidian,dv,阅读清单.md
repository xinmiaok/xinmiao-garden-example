---
recent_limit: 30
来源:  [GitHub - obsidian_vault_template_for_graduate_student](https://github.com/sheldonxxd/obsidian_vault_template_for_graduate_student)
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,dataview]]📎 [[obsidian,插件,dataview]]**

🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸

### 有`$= dv.pages('"02-Reading/mdnotes" AND #unread').where(p=>p.file.name[0]=='@').file.length`篇未读文献

```dataview
TABLE file.cday AS Date
FROM "02-Reading/mdnotes" AND #unread
WHERE file.name != "Mdnotes Default Template"
SORT file.ctime desc
```

显示所有带 unread 标签的新增文献条目，泛读后注意删去该标签并使用其它标签。


### 近期已阅

**评分维度说明**

- 相关性：指文章与当前研究课题或者拟开展的课题的相关程度
- 信息量：指文章内容能够学习参考的东西（作图、行文、数据分析）多寡
- 创新性：指文章的研究思路是否真正别出心裁让人有所启发

显示最近阅读过的`=this.recent_limit`篇文献。

```dataview
TABLE file.tags AS 标签, rating AS 评分, comment AS 初步印象
FROM "02-Reading/mdnotes"
WHERE file.name[0] = "@"
WHERE file.tags[0] != "#unread"
WHERE comment > 0
SORT file.mtime desc
LIMIT this.recent_limit
```



### 组会已分享`$= dv.pages('"02-Reading/mdnotes"').where(p=>p.share).file.length`篇

```dataview
TABLE file.tags AS Tags, comment AS Comment
FROM "02-Reading/mdnotes"
WHERE share
SORT file.cday desc
```


### Top30被引排行榜

此处显示文库中被多次引用（或批注）的文献，按反向链接次数排序：

```dataview
TABLE file.tags AS Tags, comment AS Comment, length(file.inlinks) AS cited
FROM "02-Reading/mdnotes"
SORT length(file.inlinks) desc
LIMIT 30
```