---
u: "[[设置,obsidian]]"
d:
j:
---

**◀️ [[40 - Obsidian]]>[[44 设置]]>[[设置,obsidian]]>[[obsidian,设置,笔记组织方法]]| ▶️ [[obsidian,笔记,常青笔记]]** 📎 [[标签和链接]]  [[obsidian,插件,Metadata Menu]]

🧩 标签:  
🪁 status: #🎄 #🗺️ 
🎏 class: #⛳

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240
description:: frontmatter本质就是表格的一列列属性。通过dataview（表格的filter）实现筛选功能

aliases:: frontdata
```

若文件的某些属性想显性地让用户知道，例如该md文档的父文档或子文档，或标签，或相关文档等，则可以用[[inline fields]]。在obsidian被[[obsidian,插件,dataview|dataview]]支持，在logseq中是其默认支持的属性值。一般习惯直接将[[inline fields]]放文档最前面。

- 使用的插件
	- [[obsidian,插件,dataview]]：过滤器的作用
	- [[obsidian,插件,Metadata Menu]]：特定长期使用的frontmatter的可选项
- frontmatter举例：
	- [[模板,摘录,文献]]
	- [[模板,卡片,研究人员]]
	- [[模板,研究人员,索引]]
	- [[Python,概念,卡片]]

## 应用场景
- 标识体系：状态及frontmatter
	- 🪁 status：状态标签
	- ▶️前进、  ◀️后退：双链
	- 📎相关：双链（关键词）
- 内容索引：大纲-双链 dataview
- 知识卡片[[模板,概念,卡片]]
- 图谱：[[obsidian,插件,excalibrain]]
	- `u:` `d` `j`
# 比较
标签设置（标签可以定位，字段用于界定检索的条件或呈现的内容）
- 文献可以参考的部分： #笔记/文献/参考
- 文献可参考的部分需要的是定位和检索
	- 定位是使用标签：
		- 某一类，重要或使用程度
		- 涉及领域存在交叉，使用新的标签
	- 侧边栏现在标签支持运算
	- 检索
- 适用范围
	-  [[2023年06月15日]]17:44 注意：
		- 字段具有多个词汇表述时，不能作为dataview的检索条件
		- 对检索的条件尽量用标签，如果希望标签出现在图谱或作为标签搜索框搜索到时，使用＃，而不使用tags字段
		- 字段为了显示[[obsidian,方法,双链|双链]]，点击跳转到双链卡片，垓卡片可以通过反向链接显示对应位置引用的原文 






