---
标题: obsidian,插件,QuickAdd
创建时间: 2023-01-20 16:32
修改时间: <%+ tp.file.last_modified_date() %>
作者: 
标签: "obsidian插件" 
类型1: "obsidian"
tags:  obsidian插件/模板
u: "[[设置,obsidian,插件]]"
d:
j: 
---

**◀️ [[40 - Obsidian]]>[[44 设置]]>[[设置,obsidian]]>[[设置,obsidian,插件]]| ▶️📎 **  

🧩 标签:  #软件 #笔记 #写作 #摘录
🪁 status: #🏷️
🎏 class: #🖇️

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

description :: 快速裁剪、添加或命令顺序执行插件

来源:: [快速添加任何东西的 QuickAdd 插件 ｜ Obsidian 完全指南_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1fw411f7xy/?spm_id_from=333.337.search-card.all.click&vd_source=5f738d98a287c1460eaef235b3405efd)

```

---
# 1. 介绍
description:: 快速添加笔记
## 1.1 设置
### 1.1.1 template
- 创建按钮
	- ![[Pasted image 20230120163839.png]]
- 添加名称
	- ![[Pasted image 20230120165526.png]]
- 设置参数
	- ![[Pasted image 20230120165105.png]]
	- ![[Pasted image 20230120165253.png]]
	- ![[Pasted image 20230120185721.png]]
	- ![[Pasted image 20230120185753.png]]
- 设置快捷键
	- ![[Pasted image 20230120190757.png]]
### 1.1.2 captrue
- 设置
	- ![[Pasted image 20230120192718.png]]
先复习QuickAdd的Capture、Template脚本的使用与撰写，再说明宏操作的３个步骤。 
# 2.QuickAdd的Capture、Template脚本的使用与撰写
## 2.1 Capture 范例1

Capture: Admonition的两个版本

#### 2.1.1. Templater API

```
<%*
let selection = window.getSelection();
let choice = await tp.system.suggester(
  [ "✏️ note", "📘 abstract", "ℹ️ info", "🔥 tip", "✅ success", 
  "❓ question", "⚠️ warning", "❌ fail", "🪲 bug", "📋 example", 
  "✍️ quote", "💡 comment", "😝 LOL" ], 
  [ 0,1,2,3,4,5,6,7,8,9,10,11,12 ]
  );
const admonitions = [ 
  ["ad-note", "重点"], ["ad-abstract", "摘要"], ["ad-info", "信息"], ["ad-tip", "技巧"], ["ad-success", "完成"], 
  ["ad-question", "问题"], ["ad-warning", "警告"], ["ad-fail", "失败"], ["ad-error", "错误"], ["ad-example", "范例"], 
  ["ad-quote", "引用"], ["ad-comment", "建议"], ["ad-LOL", "好笑"]
];

admonition = admonitions[choice][0];
title = admonitions[choice][1];

const nl = String.fromCharCode(10);

choice = "```" + admonition + nl +
  //"collapse: on" + nl +
  "title: " + title + nl + selection + nl +
  "```";
//tR += choice;
%>
<% choice %>
```

### 2.1.2. QuicAdd API

```
js quickadd
//const selection = window.getSelection();
const selection = this.quickAddApi.utility.getSelectedText();
const aTexts =   [ "✏️ note", "📘 abstract", "ℹ️ info", "🔥 tip", "✅ success", 
  "❓ question", "⚠️ warning", "❌ fail", "🪲 bug", "📋 example",
  "✍️ quote", "💡 comment", "😝 LOL" ];
const aValues = [ "0", "1", "2" , "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ];
let choice = await this.quickAddApi.suggester(aTexts, aValues);
//console.log("choice", choice);

const admonitions = [ 
  ["ad-note", "重点"], ["ad-abstract", "摘要"], ["ad-info", "信息"], ["ad-tip", "技巧"], ["ad-success", "完成"], 
  ["ad-question", "问题"], ["ad-warning", "警告"], ["ad-fail", "失败"], ["ad-error", "错误"], ["ad-example", "范例"], 
  ["ad-quote", "引用"], ["ad-comment", "建议"], ["ad-LOL", "好笑"]
];

admonition = admonitions[choice][0];
title = admonitions[choice][1];

// 在脚本里，换行符号和倒引号不要在字符串里使用，改用String.fromCharCode()才不会出现解析错误
const nl = String.fromCharCode(10);
const backQuotes = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);

result = backQuotes + admonition + nl +
  "title: " + title + nl + selection + nl + backQuotes;

return result;
```

## 2.2. Capture 范例2

输入关键字以插入动态图片。

```
<%*
let keywords = await tp.system.prompt("随机图片：输入关键字(以 , 分隔)");
keywords = keywords.replace(/ /g, "");
//console.log("keywords", keywords);
%>
<% tp.web.random_picture("1600x900", keywords) %>
```

## 2.3. Capture 范例3

将编码后的网址转换回正常网址。

````
```js quickadd
selObj = window.getSelection();
text = selObj.toString();
//await this.quickAddApi.utility.getClipboard();
text = await decodeURIComponent(text)
this.quickAddApi.utility.setClipboard(text);
//console.log("main " + text);
return text;
```
````

## 2.4. Template 范例

以每日笔记为范例（使用Templater、Tasks插件），介绍如何输出条件式内容。

-   [Template for QuickAdd Daily note (Using Templater, Tasks plugins)](https://gist.github.com/emisjerry/95809a56c3d5517a38d887581a2214c9)

## 2.5. 宏

宏操作由三个步骤组成：

1.  撰写脚本 js
2.  宏定义
3.  宏使用

### 2.5.1. 撰写脚本 js

在文件总管里保存库任何文件夹添加脚本档，如：my_script.js

```
async function notice1(params) {
  //({ quickAddApi } = params);
  //const quickAddApi = params.quickAddApi;
  const text = await params.quickAddApi.inputPrompt("随意输入文本...");
  new Notice(text, 5000);
  return text;
}

async function notice2(params) {
  //({ quickAddApi } = params);
  //const quickAddApi = params.quickAddApi;
  const text = await params.quickAddApi.inputPrompt("随意输入文本2...");
  new Notice(text, 5000);
  return text;
}

module.exports = { notice1,notice2 };
```

### 2.5.2. 宏定义

1.  【设置】→【插件选项】→【QuickAdd】→【Manage Macros】
2.  输入宏名称（如「macro_notice」）后点击〔Add macro〕
3.  点击添加宏的【Configure】
    1.  在【User Scripts】选用要使用的脚本后按〔Add〕
    2.  要被运行的命令会添加在上方

### 2.5.3. 宏使用

1.  【设置】→【插件选项】→【QuickAdd】
2.  在QuicAdd Settings窗口里输入名称（如 「Macro: notice」），选用【Macro】后按〔Add Choice〕
3.  在新添加的宏上点击右侧的【Configure】
4.  选择要使用的宏（即 macro_notice）

## 2.6. Capture 使用宏

在Capture format字段输入如下内容，会弹出窗口以选择要用那个函数：

```
{{MACRO:macro_notice}}
```

直接使用指定的函数，此写法似乎会影响Templater的动态命令：

```
{{MACRO:macro_notice::notice2}}
```

## 2.7. 范例档链接

-   📝 [通用笔记样板 template-quickadd.md](https://gist.github.com/emisjerry/ba75ee14716df47bfb65b22336a292c8)
-   📝 [每日笔记样板 (使用Tasks插件) template-quickadd-daily.md]( https://gist.github.com/emisjerry/95809a56c3d5517a38d887581a2214c9)
-   📝 [Capture-format: Admonition:](https://gist.github.com/emisjerry/1b1e13acaee6d65162d3c5fe76925b94)
-   📝 [QuickAdd inline JavaScript test:](https://gist.github.com/emisjerry/7d4097da9cd20c73e953da1582ea1c53)
-   📝 [QuickAdd Decode URL]( https://gist.github.com/emisjerry/155b85175f2a24994a9f05b6d2f455c3 )
-   📝 [QuickAdd Get Random Picture](https://gist.github.com/emisjerry/354671b8d4284a5b0d7ede2414c64d94)  
    致谢：部份脚本系取材自对岸的BORDER网友的分享。❤️

## 2.8. 相关链接

-   [QuickAdd GitHub](https://github.com/chhoumann/quickadd)
-   [QuickAdd Scripts参考](https://bagerbach.com/blog)
-   [QuickAdd FormatSyntax](https://github.com/chhoumann/quickadd/blob/master/docs/FormatSyntax.md)
-   [QuickAddAPI](https://github.com/chhoumann/quickadd/blob/master/docs/QuickAddAPI.md)
# 3 使用
Ctrl+Q，调用插件，输入名称
![[Pasted image 20230120191139.png]]
设置文件夹
![[Pasted image 20230120191340.png]]
![[Pasted image 20230120191447.png]]
# 相关链接






2023-01-20 19:27:51 *快速记录* 置入对应格式语法