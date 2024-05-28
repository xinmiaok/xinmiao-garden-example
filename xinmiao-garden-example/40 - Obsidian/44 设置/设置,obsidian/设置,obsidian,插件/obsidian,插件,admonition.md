---
标题: obsidian,插件,admonition
创建时间: 2023-01-21 08:08
修改时间: <%+ tp.file.last_modified_date() %>
作者: 艾了哈
标签: "obsidian插件" 
类型1: "obsidian"
tags:  obsidian插件/外观
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

description :: 为内容添加外框

来源:: [【杂货分享11】Admonition插件-提升笔记颜值的漂亮卡片框_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1XY411V7uH/?spm_id_from=333.337.search-card.all.click&vd_source=5f738d98a287c1460eaef235b3405efd)

```


---
# 功能
为内容添加卡片框
# 设置
![[Pasted image 20230121155112.png]]
![[Pasted image 20230121155345.png]]
![[Pasted image 20230121155512.png]]
# 效果
- Ctrl+P，Admonition: Insert Admonition
	- ![[Pasted image 20230121081727.png]]
- 输入设置参数
	- ![[Pasted image 20230121081803.png]]
	- ![[Pasted image 20230121081900.png]]
	- collapse: open
		- 设定可展开形式
	- color: 颜色必须遵循RGB模式
- 嵌套
	- ![[Pasted image 20230121091645.png]]
- 高亮
	- 在嵌套块内设置代码的格式，加上三个~
	- ![[Pasted image 20230121154820.png]]
- 行内形式
	- ![[Pasted image 20230121154950.png]]

```ad-seealso
title: 标题
collapse: closed
color: 192, 62, 49
内容

```
## 实例
![[Pasted image 20230121161908.png]]

# 标注
从 v0.14.0 开始，Obsidian 支持标注块，有时称为"告诫"。标注块是作为块引用编写的，灵感来自 Microsoft Docs 中的"警报"语法。

标注在 [Obsidian Publish](https://help.obsidian.md/Obsidian+Publish/Introduction+to+Obsidian+Publish) 上也原生受支持。

> [!注意]
> 出于兼容性原因，如果您还使用 Admonitions 插件，则应至少将其更新到 v8.0.0，以避免新标注系统出现问题。

使用以下语法表示标注块：。`> [!INFO]`

```
> [!INFO]
> Here's a callout block.
> It supports **markdown** and [[Internal link|wikilinks]].
```

它将显示如下：

> [!INFO]
> Here's a callout block.
> It supports **markdown** and [[Internal link|wikilinks]].


### 类型

默认情况下，有 12 种不同的标注类型，每种类型都有多个别名。每种类型都有不同的背景颜色和图标。

若要使用这些默认样式，请在示例中替换为这些类型中的任何一种。任何无法识别的类型都将默认为"note"类型，除非它们是[自定义的](https://help.obsidian.md/How+to/Use+callouts#Customizations)。类型标识符不区分大小写。`INFO`

-   note
> [!note] 注意
-   abstract, summary, tldr
> [!abstract] 摘要， 摘要， tldr
-   info, todo
> [!info] 信息， 待办事项
-   tip, hint, important
> [!TIP] 提示，提示，重要
-   success, check, done
> [!success] 成功，检查，完成
-   question, help, faq
> [!question] 问题， 帮助， 常见问题
-   warning, caution, attention
> [!warning] 警告，谨慎，注意
-   failure, fail, missing
> [!failure] 失败、失败、缺失
-   danger, error
> [!error] 危险，错误
-   bug
> [!bug] 错误
-   example
> [!example] 例
-   quote, cite
> [!quote] 引用，引用

### 标题和正文

您可以定义标注块的标题，也可以具有不带正文内容的标注。

```markdown
> [!TIP] Callouts can have custom titles, which also supports **markdown**!
```

### 折叠

此外，还可以通过在块后添加（默认展开）或（默认折叠）来创建折叠标注。`+``-`

```markdown
> [!FAQ]- Are callouts foldable?
> Yes! In a foldable callout, the contents are hidden until it is expanded.
```

将显示为：

> [!FAQ]- 标注是否可折叠？  
> 是的！在可折叠标注中，内容在展开之前一直处于隐藏状态。

### 定制

代码段和插件也可以定义自定义标注，或覆盖默认选项。标注类型和图标在 CSS 中定义，其中颜色是元组，图标是任何内部支持的图标（如）的图标 ID。或者，可以将 SVG 图标指定为字符串。`r, g, b``lucide-info`

```css
.callout[data-callout="my-callout-type"] {
    --callout-color: 0, 0, 0;
    --callout-icon: icon-id;
    --callout-icon: '<svg>...custom svg...</svg>';
}
```

# 相关链接
- [图标库 – Font Awesome 中文网](https://fontawesome.com.cn/faicons/)
- [Obsidian 插件之 Admonition - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/391252867)
- [[模板,buttons]]
- [【效率办公】Obsidain插件之Admonition-提升颜值，美观漂亮的卡片框插件 - 哔哩哔哩 (bilibili.com)](https://www.bilibili.com/read/cv15343270)


