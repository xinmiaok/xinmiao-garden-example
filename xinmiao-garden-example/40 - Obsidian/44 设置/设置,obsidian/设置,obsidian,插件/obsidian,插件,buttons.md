---
标题: obsidian,插件,buttons
创建时间: 2022-12-18 16:50
修改时间: <%+ tp.file.last_modified_date() %>
tags: obsidian插件/按钮
类型1: obsidian
来源:
- [在OB中创建按钮，一键抵达——obsidian插件buttons_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ST411N7LA/?spm_id_from=333.999.0.0)
- qianyuniao示例库
- [Obsidian中文文档](https://jackiegeek.gitee.io/obsidian-docs/zh/Obsidian/)
- [2021年新教程 - Obsidian中文教程](https://publish.obsidian.md/chinesehelp/)
- Obsidian adds support for [Callout boxes](https://help.obsidian.md/How+to/Use+callouts)!

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

description :: 创建按钮

来源:: 

```
# 1 简介
## 1.1 介绍
description:: 为网址、双链、命令等创建按钮的插件
## 1.2 下载
[插件安装](https://github.com/)
## 1.3 安装
- **方式1：**
	- 在左边工具栏→打开<kbd>设置</kbd>→<kbd>选项</kbd>→<kbd>第三方插件</kbd>→把<kbd>安全模式</kbd>（点击关闭）→在**社区插件市场**点击<kbd>浏览</kbd>→在<kbd>搜索社区插件</kbd>框，搜索你要的插件名→<kbd>install</kbd>→安装后，点击<kbd> 启用</kbd>→插件自动下载→.obsidian→plugins→安装完成

- **方式2（社区插件市场打不开情况）**
	- 在左边工具栏→打开<kbd>设置</kbd>→<kbd>选项</kbd>→<kbd>第三方插件</kbd>→把<kbd>安全模式</kbd>（点击关闭）
	- 在github搜索插件地址，比如：https://github.com/开发者用户名/插件文件地址→ 把**插件文件名**以及里面“main.js、 manifest.json和style.css”下载下来→复制或移动到→.obsidian→plugins→安装完成

- **方式3（社区插件市场打不开情况）**
	- 首先以**方式2**的安装方式→安装obsidian-proxy-github插件
	- 安装启用后
	- 就可以以第一种方式**安装社区市场**的插件

- **方式4（社区插件市场打不开情况&插件市场没有上架该插件）**
	- 首先以**方式2**的安装方式→安装obsidian42 BRAT插件。
	- Github地址：https://github.com/TfTHacker/obsidian42-brat。
	- 在左边工具栏→打开<kbd>设置</kbd>→<kbd>选项</kbd>→启用插件后<kbd>第三方插件</kbd>→<kbd> Beta plugin list</kbd>一栏→点击<kbd> Add beta plugin</kbd>→弹出的窗口输入`https://github.com/开发者github用户名/插件文件名`，然后点击<kbd>Add plugin</kbd>→插件自动下载→.obsidian→plugins→安装完成。
	- 如下图：
![image.png](https://s1.vika.cn/space/2023/01/03/96c44aba966d4548bd3e3d48963a70e7)
- **方式5（修改DNS）**
	- 打开网络共享中心
	- 找到你点电脑连接的网络
	- 点击属性
	- ipv4开头，右击属性
	- 找到DNS
	- 腾讯 119.29.29.29
	- 阿里 223.5.5.5或180.76.76.76
# 2 演示

Ctrl+P，buttons出现增加按钮、嵌入按钮选项
![[Pasted image 20221018234122.png]]

## 2.1 创建按钮

![[Snipaste_2022-10-18_23-47-22.png]]
![[Pasted image 20221018234122.png]]

```button
name bilibili
type command
action Custom Frames: Open bilibili
color default
```
^button-bilibili

---
## 2.2 嵌入按钮

```ad_abstract
title:笔记面板
collapse: open
`button-suibi`  `button-renwu` `button-memos` `button-vault` `button-bilibili`
```
增加链接不会在obsidian打开

# 3 说明
## Usage

开始使用按钮的最快方法是使用按钮制作器。你可以从命令面板打开按钮制作器。下面是按钮制作器选项的概述。

-   **Name:** 按钮的名称。
-   **Button Type:** 选择哪种类型的按钮来创建您的选项:
    -   **Command:** 单击按钮从命令面板中运行命令。
    -   **Link:** 单击按钮打开URL或URI。
    -   **Calculate:** 单击按钮以运行数学计算。计算按钮可以引用注释中的行。
    -   **Template:** 单击“按钮”可从模板注释中添加、追加、插入或创建新注释。
    -   **Text:** 计时按钮用于预先添加、追加、插入或创建带有指定文本的新注释。
    -   **Swap:** 交换按钮是内联按钮的一种特殊类型。使用交换按钮，您可以在每次单击时运行不同类型的按钮。
-   **Action:** 根据你选择的**按钮类型**，你将选择一个动作来执行:
    -   **Command:** 选择要运行的命令面板命令。
    -   **Calculate:** 写出数学方程。
    -   **Template:** 选择“前置”、“追加”、“新建注释”或“行”，然后选择要使用的模板:
        -   **Prepend Template:** 单击“按钮”可将模板预先添加到当前注释中。
        -   **Append Template:** 单击“按钮”可将模板添加到当前注释中。
        -   **Add Template at Line:** 选择模板，写下新笔记的名称，选择新笔记是否应该在分割窗格中打开。
        -   **New Note From Template:** 选择模板，写下新笔记的名称，选择新笔记是否应该在分割窗格中打开。
    -   **Text:** 选择“预结束”、“追加”、“新建注释”或“行”，然后选择要使用的文本:
        -   **Prepend Template:** 单击“按钮”可将文本预先添加到当前注释中。
        -   **Append Template:** 单击“按钮”可将文本添加到当前注释中。
        -   **Add Template at Line:** 单击“按钮”可将文本添加到当前注释的指定行中。
        -   **New Note From Template:** 书写新笔记的名称，选择新笔记是否应在分割窗格中打开。
    -   **Swap:** 写下按钮的按钮块id，交换按钮将在每次点击， e.g. `[id1, id2]` (有关交换按钮的更多信息，请参见下面).
-   **Remove:** 单击按钮后，可以删除按钮。你也可以通过提供一个按钮块id数组来删除注释中的其他按钮， e.g. `[id1, id2]`.
-   **Replace:** 您可以从现有的注释中删除行，然后使用**追加模板**或**Prepend模板**按钮类型将其替换。用开始行号和结束行号编写数组， e.g. `[startingLine, endingLine]`.
-   **Inherit:** 通过添加另一个Button的Button -block-id，您正在创建的Button可以继承参数。
-   **Templater:** If the templater arg is `true` you can include a Templater command inside your button. The command will be converted to its value when the button is clicked and converted back to the command after. This cannot be used with Inline Buttons.
-   **Custom Class:** Supply a custom CSS class to style your Button.
-   **Color:** Choose a Button color.

### Button Block ID

The button-block-id is a block-id placed direcly below a Button codeblock and starts with `button`, e.g. `^button-id`. Button-block-ids can be used to:

-   Create inline buttons (see below for details on inline buttons) `button-button1`
-   Choose which Buttons to use in an Inline Swap Button: `swap [button1, button2]`
-   Inherit arguments from another Button: `id button1`
-   Remove multiple Buttons with a `remove [button1, button2]` argument

### Inline Buttons

内联按钮可以与其他文本或其他按钮一起内联创建。内联按钮本质上是内联放置的现有按钮代码块的副本。创建一个内联按钮:

1.  Create a regular Button using the Button Maker or hand-written Button codeblock.
2.  Ensure your Button has a unique button-block-id.
3.  Go to the note you want an inline Button and run the Insert Inline Button Command, or write the button-block-id between backticks, e.g. `button-id`.

Inline Buttons must start with `button`, whereas other usages of the button-block-id only require the id.

### Swap Button

A Swap Button is a special type of Inline Button. When you click a Swap Button it cycles through multiple other Buttons. Use a Swap Button to run a succession of actions with one Button. To Create a Swap Button:

1.  Create Buttons that perform the actions you want the Swap Button to do. Ensure each button has a unique button-block-id.
2.  Create a Swap Button and supply the button-block-id of the other buttons, e.g. `swap [id1, id2, id3]`. Ensure the Swap Button has a unique button-block-id.
3.  Insert the Swap Button as an Inline Button using the Insert Inline Button Command.

Swap Buttons can currently only be used as Inline Buttons.

### Inherit Button Args

If you are using the same (or similar) Buttons across many notes, you can create one parent Button and have other Buttons inherit from the parent.

1.  Create a Parent Button with the arguments you'd like to be inherited. Ensure the Parent Button has a unique button-block-id.
2.  Create Child Buttons and supply the Parent Button button-block-id `id parentButton`.

Child Buttons can also have their own arguments. Any argument supplied on the Child supersedes arguments from the Parent Button.

### Templater Button

模板程序参数允许您在按钮内提供模板程序命令。单击按钮时，该命令将转换为其值，然后在下次单击时转换回模板程序命令。这最好与“新建笔记按钮”类型一起使用。

A button with this command…

````
```button
name Make an Hourly Note
type note(17:12) template
action Log Template Note
templater true
```
````

…will convert when clicked to:

````
```button
name Make an Hourly Note
type note(16:20) template
action Log Template Note
templater true
```
````

And then `09` will change back to `17:12`.

The Templater arg also works with the Text Button type:

````
```button
name Add Current Time
type line(1) text
action 17:32:51
replace [1,1]
templater true
```
````

This will insert the current time on line one of the note, replacing any existing text on that line and then convert back to the Templater command for future use.

### Button Styling

#### Style Settings

安装样式设置插件，以方便更改默认的按钮样式。

#### Custom Class

If you want a truly custom style, or want Buttons with multiple different styles, you can add a `class` argument in a Button and use a css snippet to style it.

### Remove Button after command execution

If you have a Button that only needs to run once and then can be removed from a note (handy for inserting prompts into a Daily Note) you can add a `remove true` argument to your Button.

If you have multiple Buttons in a note and want to remove them all when a Button is clicked, you can supply an array of button-block-ids to the `remove` argument, e.g. `remove [id1, id2, id3]`.

### Replace content in section

When using an Append or Prepend Template Button, you may want to remove lines from the existing note which will be replaced by the Template. To do this, write a `replace` argument and supply the first line and last line in an array; e.g. `replace [1, 5]` will remove lines 1 through 5.

## Examples

### Command Button

Open the previous day's daily note using the Periodic Notes Plugin:

````
```button
name Open Previous Daily Note
type command
action Periodic Notes: Open previous daily note
```
^button-previous
````

Turn spellcheck on/off:

````
```button
name Toggle spellcheck
type comand
action Toggle spellcheck
color blue
```
^button-spellcheck
````

### Link Button

Open the Obsidian Forum:

````
```button
name To the Forum Batman!
type link
action https://forum.obsidian.md/
```
^button-forum
````

### Template & Line Button

#### Append

Append a Log Template Note:

````
```button
name Log
type append template
action Hourly Log Template Note
```
^button-log
````

Append the current time:

````
```button
name Log
type append text
action 17:32
templater true
```
````

#### Prepend Template

Replace a Weather Template Note with the updated Weather:

````
```button
name Current Weather
type prepend template
action Weather Template Note
replace [1,5]
```
^button-weather
````

Prepend a weekly todo list and remove other buttons:

````
```button
name Monday List
type prepend template
action Monday Template Note
remove [mon,tues,wed]
```
^button-mon

```button
name Tuesday List
type prepend template
action Tuesday Template Note
remove [mon,tues,wed]
```
^button-tues

```button
name Wednesday List
type prepend template
action Wednesday Template Note
remove [mon,tues,wed]
```
^button-wed
````

Even better, set up those buttons and then add them all on one line as Inline Buttons:

```
`button-mon` `button-tues` `button-wed`
```

### Add Template at Line

Say you want the weather to appear at a specific place in your note that isn't directly beside the button:

````
```button
name Current Weather
type line(1) template
action Weather Template Note
replace [1,5]
```
^button-weatherLine
````

#### New Note From Template

Create a new note for an upcoming meeting based on a Meeting Note Template:

````
```button
name New Meeting
type note(Meeting, split) note
action Meeting Note Template
```
^button-meeting
````

Dynamically add the hour and minute to the note title:

````
```button
name New Meeting
type note(Meeting-17-12, split) note
action Meeting Note Template
templater true
```
^button-meeting2
````

### Calculate Button

Do some simple math:

````
```button
name Add Em Up
type calculate
action 2+2
```
^button-add
````

Reference numbers outside of the Button:

````
Bananas Have: 5  
Bananas Lost: 5

```button
name How Many Bananas Today?
type calculate
action $1-$2
color yellow
```
^button-bananas
````

Natural Language Math:

````
5 dogs plus 2 cats divided by 2 people

```button
name Who Get The Pets?
type calculate
action $1
class sad-button
```
^button-breakup
````

The calculate button uses [math-expression-evaluator](https://github.com/bugwheels94/math-expression-evaluator), so it should support any symbol supported by that library.

### Swap Buttons

Let's create a Swap Button using the button-block-id of previous Buttons:

````
```button
name Crazy Swap Button
swap [add,meeting,forum]
```
^button-swap
````

Then insert that button inline:

```
`button-swap`
```

1.  On the first click of Crazy Swap Button we will add 2+2.
2.  On the second click of Crazy Swap Button we will create a new Meeting note.
3.  On the third click of the Crazy Swap Button we will go to the Obsidian forum.

Note: swap count is reset if you close the note.


# 相关链接
[[obsidian,插件,admonition]]