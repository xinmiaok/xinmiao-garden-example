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

[Thanks](https://github.com/zazaji/obsidian-SenGener/#thanks)

Sengener based on obsidian-completr. I copied lots of code from it. [https://github.com/tth05/obsidian-completr](https://github.com/tth05/obsidian-completr)

[How to use this plugin](https://github.com/zazaji/obsidian-SenGener/#how-to-use-this-plugin)

1.  download and install obsidian. Create a vault and specify the path.下载并安装黑曜石。创建一个库并指定路径。
    
2.  goto the vault folder. download from releases , and extract them to the plugin folder, the path like: VAULT/.obsidian/plugins/obsidian-sengener. 进入 vault 文件夹。从版本中下载，然后解压缩到插件文件夹，路径如下： VAULT/.obsidian/plugins/obsidian-sengener.
    
3.  Open setting, enable community plugins, then set you options, enable SenSener and configure hot-keys. The default shortcut key is ctrl+`quotation`. 打开设置，启用社区插件，然后设置选项，启用 SenSener 并配置热键。默认快捷键是ctrl+引号。
    
4.  You can also select different authoring models and adjust other parameters. 您还可以选择不同的编写模式，并调整其他参数。
    
5.  Create a document and start writing. Enjoy it. And contact me: [zazaji@sina.com](mailto:zazaji@sina.com). 创建文档，开始写作。请尽情享受。请与我联系：zazaji@sina.com。
    

## [Parameter](https://github.com/zazaji/obsidian-SenGener/#parameter)

-   API address: service address : Fill in your own API address. I built an example service, which includes English model, dialogue model（Chinese）, work report model（Chinese） and Tencent welm model（Chinese and few English suport）. API 地址：服务地址：填写您自己的 API 地址。我建立了一个示例服务，其中包括英文模型、对话模型（中文）、工作报告模型（中文）和腾讯 welm 模型（中文和少量英文支持）。和 Tencent welm 模型（中文和少量英文支持）。Sample address: [https://fwzd.myfawu.com](https://fwzd.myfawu.com/)
- Type: 可以选择不同的创作模型。
- token: 用于登录腾讯welm的token。可自己去腾讯welm官网申请。
- enable searching: 是否启用全文检索。目前为report模型提供全文检索。
- Number of choices: 多少个候选项。不要选太多，影响速度。
- max length: 一次产生的文字（英语是词）的数量。不要选太多，影响速度。

## [Build your data service](https://github.com/zazaji/obsidian-SenGener/#build-your-data-service)

-   I build the API service with GPT2. You can also use GPT2 to generate Sentenses directly , or Another one, like yuanyu, or chatGPT.我用 GPT2 构建了 API 服务。您也可以直接使用 GPT2 生成 Sentenses，或使用另一种方法，如 yuanyu 或 chatGPT
    
-   You can build your API service for generating Sentenses. Or you can use the sample service, just for test. 您可以为生成 Sentenses 构建自己的 API 服务。也可以使用示例服务进行测试。
    
-   The example provides english model and chinese model, and Full-text search . If you want use Another language , you can train your language generation service. 示例提供了英语模型和中文模型，以及全文搜索。如果您想使用其他语言，可以训练您的语言生成服务。
    
-   Data service contain text-generator and full-text-search. **The new repo will be on soon**. 数据服务包含文本生成器和全文检索。**新版本库即将上线**。
    
-   You can build a API service like : Post Json: 您可以构建一个 API 服务，如 发布 Json：
    

{
	"context": "Yes, We ",
	"token": "Your_token",
	"article_type": "english",
	"max_length": 10,
	"number": 3,
	"is_index": true
}

Response Json:

{
	"ref": [{
		"content": "...",
		"title": "Nothing"
	}],
	"sentenses": [{
		"value": ", the people of the United States, stand together"
	}, {
		"value": " to say, this is the best deal we've"
	}, {
		"value": " can't say anything, but it's not our"
	}]
}
# 相关链接





