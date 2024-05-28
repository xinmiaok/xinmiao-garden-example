---
标题: obsidian,插件,mind map
创建时间: 2022-10-23 23:45
修改时间: <%+ tp.file.last_modified_date() %>
类型1: obsidian
tags: obsidian插件/思维导图
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

description :: 绘制思维导图

来源:: [obsidian插件mind map——标题和列表均可生成思维导图_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1224y1Z7Yb/?spm_id_from=333.999.0.0)

```

---

# 1 介绍
## 1.1 功能
desciption:: 绘制树状图

# 2 使用
## 2.1 mindmap 基本操作
### 2.1.1 复制和粘贴 mindmap的节点
1.  选择节点
2.  Ctrl/Cmd + P
3.  Click _Copy_ command
4.  选择其他节点
5.  Ctrl/Cmd + P , click _Paste_ command

### 2.1.2 创建mindmap的节点
#### 方法1
将下面yaml添加到markdown文件中:
```
mindmap-plugin: basic
```

然后你可以在`更多`选项中找到_打开为思维导图_菜单

![image.png](https://s1.vika.cn/space/2022/12/26/31cd096205e6466d8f181543840c1641)

#### 方法2
右键单击文件夹 , 点击“新建思维导图板”菜单

![image.png](https://s1.vika.cn/space/2022/12/26/fa5a272182b54a63ad286837efbfc464)

**基本模式将输出这个markdown:**
 
 ```md 
 
        ---  
        mindmap-plugin: basic
       ---  
    
# Mark mind for obsidian  
## Links 
       - https://github.com/MarkMindLtd/obsidian-markmind 
       - [GitHub](https://github.com/MarkMindLtd/obsidian-markmind) 
       
## Related 
       - [coc-markmap](https://github.com/gera2ld/coc-markmap) 
       - [gatsby-remark-markmap](https://github.com/gera2ld/gatsby-remark-markmap)  
## Features 
       - links 
       - **inline** ~~text~~ *styles* 
       - multiline    text 
       - `inline code` 
       - Katex 
       - $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$
    
```

## 2.2 丰富模式的思维导图
### 2.2.1 创建思维导图
#### 方法1

将以下语句添加到 markdown文件中yaml部分:

```
---  
mindmap-plugin: rich  
---
```       

然后你可以在更多选项中找到_打开为思维导图_菜单
![image.png](https://s1.vika.cn/space/2022/12/26/31cd096205e6466d8f181543840c1641)


#### 方法2

在插件设置的标签页，将 _mindmap mode_ 从 `basic` 改为 `rich` 

右键文件夹 , 点击菜单栏新建思维导图选项。

![](https://markmindckm.github.io/markmind-docs/img/richsetup.71f5479f.gif)

![](https://markmindckm.github.io/markmind-docs/img/richsetup2.31bbc12a.gif)

  

### 2.2 思维导图导出为图片

按 ctrl + p , 然后点击导出思维导图至HTML （_export mindmap to html_ ）命令

> [!note] 思维导图中的图片必须是本地图片, 不支持网络中的图片

## 2.3 大纲

Add yaml to markdown:

```
 ---  
 mindmap-plugin: basic 
 display-mode: outline  
 ---
 ```

Then click _Open as mindmap_ menu in more options

![](https://markmindckm.github.io/markmind-docs/img/outline.56e1f66d.gif)

# 2.4 表格
[[Table演示]]
Add yaml to markdown:

 ```
 ---  
mindmap-plugin: basic 
display-mode: table
---
  ```

Then click _Open as mindmap_ menu in more options



## 2.5 Embed mindmap in other markdown file

Use ![[Basic modey演示]] to embed mindmap in other markdown file


## 2.6 Get Markdown text from mindmap
Select node
Click Copy as markdown menu in more options


## 输入语法
Ctrl+P，min

---

标题
![[Pasted image 20221023235223.png]]

---

针对列表的情况
	tab键创建子列表
![[Pasted image 20221023235535.png]]

---

列表粘贴到一级标题
![[Pasted image 20221023235808.png]]

---

# 相关链接
















