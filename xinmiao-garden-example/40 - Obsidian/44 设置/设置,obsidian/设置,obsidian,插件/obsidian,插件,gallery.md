---
标题: obsidian,插件,gallery
创建时间: 2023-01-18 18:31
修改时间: <%+ tp.file.last_modified_date() %>
作者: 
标签: "obsidian插件" 
类型1: "obsidian"
tags:  obsidian插件/浏览
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

description :: 图片库

来源:: 

```


---
# 功能

# 设置
- 设置存放图片信息的文件夹
	- ![[Pasted image 20230120134615.png]]
- 点击图标，打开标签页，右侧工具栏会出现gallery图标
	- ![[Pasted image 20230120140406.png]]
- 在gallery标签页点击单个图片，右侧显示对应信息，并在开始设置的文件夹生成单独的文件
	- ![[Pasted image 20230120141242.png]]
- 多列显示
	- ![[Pasted image 20230120151512.png]]
	- ![[Pasted image 20230120151537.png]]
# 使用
- 1.支持检索
	- ![[Pasted image 20230120141820.png]]

# 介绍

-   Main Gallery to tag / filter / add notes to images.Main Gallery
	- <font color="#31859b">可为图像添加标签/过滤/添加注释</font>
-   Display blocks to embed images inside notes
	- <font color="#31859b">显示以将图像嵌入注释中的块</font>
-   Display block to an image information
	- <font color="#31859b">显示含有图像信息的块</font>

#### Example:

##### Main Gallery

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_main_gallery_1.gif)

##### Main Gallery Filtering

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_main_gallery_2.gif)

##### Display blocks

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_Display_Block.gif)

##### Display Image Info block

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_Info_Block.gif)

##### Old example

![example_1](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_1.png)

## Usage:

### Image display block Usage

e.g. Input:

```
path=Weekly
name=.*Calen
imgWidth=400
divWidth=70
divAlign=left
reverseOrder=false
customList=5 10 2 4
```

Argument Info:

-   **type**: specify display type. Possible values grid, active-thumb
-   **path**: vault path to display images from. Regex expression
-   **imgWidth**: image width in pixels
-   **divWidth**: div container in %
-   **divAlign**: div alignment. Possible values left, right
-   **reverseOrder**: reverse the display order of images. Possible values true, false
-   **customList**: specify image indexes to display in the passed order

## Settings:

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Gallery_Settings.png)

# 相关链接
[GitHub - Darakah/obsidian-gallery：主画廊，用于标记/过滤/添加图像注释。显示块以在笔记中嵌入图像。显示块到图像信息](https://github.com/Darakah/obsidian-gallery)




