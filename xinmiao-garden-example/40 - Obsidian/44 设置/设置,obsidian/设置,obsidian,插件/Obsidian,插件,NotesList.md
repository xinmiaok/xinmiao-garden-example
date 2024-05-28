---
标题: Obsidian,插件,NotesList
创建时间: 2023-09-23 19:33
修改时间: <%+ tp.file.last_modified_date() %>
tags: obsidian插件/外观
类型1: "obsidian"
用途: 模板
u: "[[设置,obsidian,插件]]"
d:
j: 
---

**◀️ [[40 - Obsidian]]>[[44 设置]]>[[设置,obsidian]]>[[设置,obsidian,插件]]| ▶️📎 **  

🧩 标签:  #软件 #笔记 #写作
🪁 status: #🏷️
🎏 class: #🖇️

👉点击这里 `button-ShowPPT`

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240
description :: 图片显示特定文件夹笔记数量

来源:: [通过图片预览笔记条目！多种方案分享！ - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/19445)
```

---

# 🍀Obsidian-Notes-List
Dataview Snippet To Show Notes In Different List Views 
- *在不同列表视图中显示注释的数据视图片段*

## 🧀Story
> All Obsidian users switched from some other note-taking programme (such as Evernote, Apple Notes, Standard Notes, Bear Notes) to Obsidian. When switching, many users lack a list of all notes with a small excerpt of the text and, if applicable, a thumbnail image. This Dataview snippet makes it possible to retrofit this missing view with a single line of code. All that is needed is the Dataview plugin.
- 所有黑曜石用户都是从其他笔记软件（如 Evernote、Apple Notes、Standard Notes、Bear Notes）转到黑曜石的。在切换时，许多用户都缺少一个附有小段文字摘录和缩略图（如适用）的笔记列表。这个 Dataview 代码段只需一行代码就能改装这种缺失的视图。只需使用 ==Dataview== 插件即可。

## 🧰Setup
- 1 Install "**Dataview Plugin**" from the external plugins
	- *从外部插件中安装 "Dataview 插件*
- 2 Create a new folder called "notesList" or any other name and paste the files "view.js" and "view.css" into it
	- *新建一个名为 "notesList "或其他名称的文件夹，并将 "view.js "和 "view.css "文件粘贴到其中*
    - <img width="205" alt="Bildschirm­foto 2022-10-16 um 14 25 00" src="https://user-images.githubusercontent.com/59178587/196035303-72d032a9-09b2-4c98-9afa-c2b835a2b107.png">
- 3 Create a new note or edit an existing one and add the following code line: 
	- *创建新备注或编辑现有备注，并添加以下代码行：*

    ````
    ```dataviewjs
    dv.view("notesList", {pages: "", view: "normal"})
    ```
    ````
    
    - If you paste the main files (js/css) into another folder then "notesList", you have to replace the name between the first quotation marks. 
	    - *如果将主文件（js/css）粘贴到另一个文件夹中，然后再粘贴到 "notesList "中，则必须替换第一个引号之间的名称。*
 
 - 4 There are 2 different variables to set path/location as "pages", list view style as "view".
	 -  *有两个不同的变量，可将**路径/位置**设置为 "页面"，将**列表视图样式**设置为 "视图"。*
 

---
### pages:
```
pages: ""
```

Get all notes in obsidian. *获取所有黑曜石笔记。*

```
pages: "Notes/Theology"
```

Set a custom folder to get notes from. *设置一个自定义文件夹来获取笔记。*

---

### view:
```
view: "normal"
```
List view with small text preview and a preview of all attachments below like in Bear. 
- *带小文本预览的列表视图，并可预览下方的所有附件，就像在 Bear 中一样。*

```
view: "compact"
```
List view with small text preview and a preview of the first attachment inside the note. 
- *带小文本预览的列表视图，以及便笺内第一个附件的预览。*

```
view: "cards"
```
List view with small cards of each note including small text preview and a preview of the first attachment inside the note.
- *列表视图，每个便笺都有小卡片，包括小文本预览和便笺内第一个附件的预览。*
    
---

## Impressions

### Normal View
<img width="711" alt="Bildschirm­foto 2022-10-16 um 14 16 45" src="https://user-images.githubusercontent.com/59178587/196035529-cc727ad6-36e4-4085-a6b9-65dd2091f3f9.png">

---

### Compact View
<img width="703" alt="Bildschirm­foto 2022-10-16 um 14 17 41" src="https://user-images.githubusercontent.com/59178587/196035534-8da3fd4e-646f-4f75-a8d4-544f44147aea.png">

---

### Cards View
<img width="672" alt="Bildschirm­foto 2022-10-16 um 14 18 18" src="https://user-images.githubusercontent.com/59178587/196035541-e28b89fe-3cd7-4f80-a3dd-6b258082710d.png">
