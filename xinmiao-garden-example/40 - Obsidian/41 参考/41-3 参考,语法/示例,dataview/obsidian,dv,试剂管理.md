---
标题: obsidian,dv,试剂管理
创建时间: 2023-10-29 10:31
修改时间: <%+ tp.file.last_modified_date() %>
作者: 
标签: "obsidian插件" 
类型1 "obsidian"
tags:  obsidian插件
用途: 模板
来源: [GitHub - obsidian_vault_template_for_graduate_student](https://github.com/sheldonxxd/obsidian_vault_template_for_graduate_student)
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,dataview]]📎 [[obsidian,插件,dataview]]**

🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸


```ad-info
title: <u></u>**描述**
collapse: open
color: 142, 106, 120
description :: 

来源::

 **▶️ 子节点|**
```








### 试剂库存

```dataview
TABLE 名称, 存放位置 AS 存放
FROM "06-Cards" AND #试剂库存
SORT file.name desc
```