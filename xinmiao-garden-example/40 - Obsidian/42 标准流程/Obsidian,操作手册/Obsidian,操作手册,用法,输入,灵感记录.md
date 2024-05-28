---
标题: Obsidian,操作手册,用法,输入,灵感记录
创建时间: 2023-08-18 11:05
修改时间: <%+ tp.file.last_modified_date() %>
tags: 
类型1: 
用途: 模板
---
**◀️ [[Obsidian,操作手册]]| 📎** 

🧩 标签: #软件 #笔记 #写作 #memo 
🪁 status: #🔖 
🎏 class: #📸 

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

**◀️ 父节点| ▶️ 子节点** 
description :: 

来源:: [Johnny学OB 第36集 用QuickAdd 快速记录你乍现的灵感，以及Button和Sidebar的用法 Obsidian教程_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV14u411Z7sJ/?spm_id_from=333.337.search-card.all.click&vd_source=5f738d98a287c1460eaef235b3405efd)

```

### 插件
- [[obsidian,插件,QuickAdd]]
- [[obsidian,插件,buttons]]
- memo
- [[obsidian,插件,dataview]]

### 操作
![[Pasted image 20230120203834.png]]
### Captrue
- 设置介绍
	- 保存到当前文件
		- ![[Pasted image 20230120204210.png]]
	- 保存的文件名
		- ![[Pasted image 20230120204403.png]]
	- 在······插入的
		- ![[Pasted image 20230120204617.png]]
	- 样式
		- ![[Pasted image 20230120204708.png]]
- 添加按钮
	- 按钮可以集中收集到一个笔记中[[模板,buttons]]
	- 添加命令
		- ![[Pasted image 20230120212932.png]]
	- 把命令添加到按钮中
		- ![[Pasted image 20230120213337.png]]
		- ![[Pasted image 20230120213448.png]]
		- ![[Pasted image 20230120213525.png]]
	- 按钮样式修改
		- 更改为默认设置
			- ![[Pasted image 20230120214607.png]]
		- obsidian插件style setting 更改颜色
		- ![[Pasted image 20230120214533.png]]
		- ![[Pasted image 20230120214637.png]]
- 按钮添加到面板

## memo检索
```
```ad-todo
title: Memo记录
collapse: closed
color: 175, 160, 203
```dataviewjs

let folderChoicePath = "00 - 计划记录"
const files = app.vault.getMarkdownFiles().filter(file => file.path.includes(folderChoicePath))

let arr = files.map(async(file) => { 
    const content = await app.vault.cachedRead(file) 
    let lines = await content.split("\n").filter(line => line.includes("#memo")) 
    //console.log(lines) 
    return [dv.fileLink(file.name.split(".")[0], false, moment(file.name.split(".")[0], "YYYY年MM月DD日").format("M月D日")), lines] 
}) 

Promise.all(arr).then(values => { 
    const beautify = values.map(value => { 
        const temp = value[1].map(line => { return line.slice(4,) }) //美化要重写
        return [value[0],temp] 
    }) 
    const exists = beautify.filter(value => value[1][0] && value[0] != "[[未命名 10]]").slice(0,100).sort().reverse()
    dv.table(["Date", "Log"], exists)
})
```

## 相关链接
[[信渺]]

---