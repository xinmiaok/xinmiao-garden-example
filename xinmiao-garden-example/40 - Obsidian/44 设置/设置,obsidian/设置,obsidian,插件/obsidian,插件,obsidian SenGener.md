---
标题: obsidian,插件,obsidian SenGener
创建时间: 2023-09-21 13:35
修改时间: <%+ tp.file.last_modified_date() %>
作者: [Zazaji](https://github.com/zazaji)
标签: "obsidian插件" 
类型1: "obsidian"
tags:  obsidian插件
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

description :: 基于大语言模型的写作辅助系统

来源:: [GitHub - zazaji/obsidian-SenGener: This plugin is used to generate a serial of Sentenses for writting.](https://github.com/zazaji/obsidian-SenGener/)

```

---
# 功能
description:: 基于obsidian的插件辅助写作的插件
# 设置

# 使用

在写作的过程中，当文思枯竭的时候，按下快捷键（可以定义自己的快捷键），然后AI自动根据之前写的内容，自动给出提示。同时，在右侧边栏还能根据上句话，在文档库中进行全文检索，找到相应的内容。

**实现具体过程** 
	
从部分网站抓取了一些工作报告、百科、党建、新闻等数据。 使用深度学习（我是用的是GPT2），训练了几个专业的模型，不同的模型，如写报告类、新闻类，效果和应用场景不同。当然，写诗填词也不在话下。 同时将这些数据做成全文检索，并将检索和模型做成数据服务。 使用obsidian的时候，通过快捷键调用数据服务，实现推荐列表和参考关联文档功能。 目前我搭建了一个示例服务，基本做到开箱即用，方便大家免费测试使用。 使用方法 下载安装obsidian。 创建一个文库，并指定路径。 进入该文库，并启用第三方插件模式。 进入到文库所在路径，将github上的main.js、style.css放入.obsidian/plugins/obsidian-SenGener文件夹。 如果觉得以上操作复杂了，可采用最简单的方式，将github上的test.zip下载解压后，用obsidian打开，然后启用第三方插件模式。 在第三方插件中启用该插件。并配置快捷键。默认快捷键是ctrl + 引号。也可以选择不同的创作模型，调整其他参数。 创建一个文件，开始写作。 参数介绍 API address: 服务地址，填写自己的API地址。我搭建了一个示例服务，里面包含了英文模型、对话模型、工作报告模型、腾讯welm模型。地址：[https://fwzd.myfawu.com/](https://fwzd.myfawu.com/)

[



