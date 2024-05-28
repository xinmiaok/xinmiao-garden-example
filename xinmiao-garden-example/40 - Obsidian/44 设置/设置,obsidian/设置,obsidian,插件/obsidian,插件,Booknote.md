---
标题: obsidian,插件,Booknote
创建时间: 2023-06-07 03:56
修改时间: <%+ tp.file.last_modified_date() %>
作者: 
标签: "obsidian插件" 
类型1: "obsidian"
tags:  obsidian插件/管理/书籍
用途: 模板
u: "[[设置,obsidian,插件]]"
d:
j: 
---

**◀️ [[40 - Obsidian]]>[[44 设置]]>[[设置,obsidian]]>[[设置,obsidian,插件]]| ▶️📎 **  

🧩 标签:  #软件 
🪁 status: #🏷️
🎏 class: #🖇️

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

description :: 书籍管理的插件

来源:: [更新0.2.4(20220209) 如何安装并使用booknote插件？ - 飞书云文档 (feishu.cn)](https://kknwfe6755.feishu.cn/docs/doccnBfbtETItLHMmbDBGBRdPrh)，[如何安装并使用booknote插件 by Cuman - Obsidian中文教程 - Obsidian Publish](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/%E5%A6%82%E4%BD%95%E5%AE%89%E8%A3%85%E5%B9%B6%E4%BD%BF%E7%94%A8booknote%E6%8F%92%E4%BB%B6+by+Cuman)

📎

```

---

# 下载
[GitHub - chenghongyao/obsidian-booknote-plugin](https://github.com/chenghongyao/obsidian-booknote-plugin)
# 安装步骤
booknote插件支持本地部署，和在线服务两种方式使用。如果使用在线服务，不需要webview，直接就可以使用，只是速度慢一些。
下面演示使用本地服务如何部署，以windows为例：
## 1.安装webview
因为插件使用webview服务，所以需要先安装webview环境。

# 功能
- Book Explorer
	- 书籍管理器，所有书籍在同一根目录
- Book Project
	- 项目=书+笔记
	- 多本书
- Advanced Book Explorer
	- 文献管理器，目标是实现zetero或endnote类似的功能
	- 对文件信息进行设置，生成Yaml部分带有文件信息新的笔记
# 设置
[booknote插件-初步框架_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ZS4y1Q78z/?vd_source=5f738d98a287c1460eaef235b3405efd)

![[Pasted image 20230614151648.png]]

## Book Project

yaml
```
booknote-plugin: true
booknote- books: 
 - 英语/Academic Vocabulary in Use by Michael McCarthy, Felicity ODell (z-lib.org).pdf#文件存放路径
```

```dataview
table 
from "30 - 摘录"
where 类型1="文献阅读"
```

 
## 
# 使用
## 操作
### 调出OB页面：Ctrl+P
## Book Explorer
### 打开Book Explorer：BookNote: Open Book Explorer
- ![[Pasted image 20230614152927.png]]
- ![[Pasted image 20230614153206.png]]
### 切换书库
- ![[Pasted image 20230614160929.png]]
## Book View
### 打开Book View
- 命令：Book: search book
	- 用于打开Book View, 需要事先安装webviewer，并在设置里打开本地服务器
- 也可以直接双击Book Explorer中的文件进入到该文件的Book View视图
- 点击Book Explorer的搜索按钮
### Book View添加注释
Book View视图顶端图标 
![[Pasted image 20230614155824.png]]

### 复制回链到笔记
目前两种方式
- 复制回链，在任意文档手动粘贴。+ ![[Pasted image 20230614155637.png]]
- 按住ctrl点击 复制回链 可以在当前激活的文档中**所在光标处**自动添加回链。  

![](https://kknwfe6755.feishu.cn/space/api/box/stream/download/asynccode/?code=MWJlNjQxYWIxZTljYTY1MjM2MjBlM2ZiMTA2M2RjMGZfRzhQSmxtSHhXMnFIZENRS2xRZ093NmlRSnlxMEhnNVBfVG9rZW46Ym94Y25wSXlud1g1QkJVZHN1Q0ptSDhaRnRiXzE2ODY3Mjg1MDk6MTY4NjczMjEwOV9WNA)

### 文件跳转链接：pdf，office文档添加Obsidian链接
![[Pasted image 20230614155745.png]]


###
### 
###
# 相关链接





