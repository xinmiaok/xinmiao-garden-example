---
aliases: 可视化任务日历汇总
tags: 
cssclass:
source: https://github.com/702573N/Obsidian-Tasks-Calendar
created: "2022-11-08 08:29"
updated: "2022-11-08 08:34"
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,dataview]]| ▶️ **

🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸

> 如果使用 tasks 插件设置有 任务日期，可以通过日视图，周视图，月视图进行可视化呈现。

## 任务日历

```dataviewjs
await dv.view("tasksCalendar", {pages: "", view: "month", firstDayOfWeek: "1", options: "style1"})
```

