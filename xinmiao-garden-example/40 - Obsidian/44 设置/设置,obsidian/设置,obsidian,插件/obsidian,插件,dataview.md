---
标题: obsidian,插件,dataview
创建时间: 2022-12-18 16:50
修改时间: <%+ tp.file.last_modified_date() %>
tags: obsidian插件/图表
类型1: obsidian
作者: 余汉波, 千语鸟
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

description :: 显示过滤的表格

来源:: [obsidian插件dataview——强大的数据视图插件，以数据库索引呈现_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Fe411g7DQ/?spm_id_from=333.337.search-card.all.click)
```


## 范例
- [[dataviewjs常用使用示例范例]]
- [[dataview常用使用示例范例]]
## 基础语法
- [[obsidian,语法,dataview基础语法#dataview 基础语法]]
- [Queries - Dataview](https://blacksmithgu.github.io/obsidian-dataview/query/queries/)
## 高级语法
- [[obsidian,语法,dataviewjs高级语法]]

## dataviewjs 的参考资料

[[鸟姐的dataviewjs技巧]]  
[ObsidianDataview文档中文 - 知乎](https://www.zhihu.com/column/c_1504479637841866752)

[Obsidian 插件之 Dataview - 少数派 (sspai.com)](https://sspai.com/post/68183)



## 数据筛选

### 检索范围 from

这目前意味着按文件夹，按标签或传入/传出链接。`FROM`

1.  **标签**： 表格的来源 .`#tag`
2.  **文件夹**：表单的来源 。`"folder"`
3.  **特定文件**：指定文件路径：。`"folder/File"`
    -   如果有路径完全相同的文件和文件夹，则 Dataview 优先选择该文件夹。可以指定文件：`folder/File.md`
4.  **链接**：您可以选择指向文件的链接，也可以选择文件中的所有链接。
    -   要获取链接到的所有页面，请使用 。`[[note]]``[[note]]`
    -   要获取该文件中的所有链接，请使用 。`[[note]]``outgoing([[note]])`
    -   可以通过 或 隐式引用当前文件。`[[#]]``[[]]`

高级筛选 (and or !)与或非

-   例如，`#tag and "folder"``folder``#tag`
-   从 中查询将仅返回包含但不包含 的页面。`#food and !#fastfood``#food``#fastfood`
-   `[[Food]] or [[Exercise]]`将给出任何链接到OR的页面。`[[Food]]``[[Exercise]]`

排除指定标签和文件夹：`-`

-   `-#tag`将排除具有给定标记的文件。
-   `#tag and -"folder"`将仅包含标记的文件，这些文件不在 中。`#tag``"folder"`

### 聚合条件 where

筛选字段上的页面。只有子句的计算结果为的页面才会生成。`true`

`WHERE <clause>`

1.  获取过去 24 小时内修改的所有文件：
    
    `LIST WHERE file.mtime >= date(today) - dur(1 day)`
    
2.  查找所有未标记为已完成且已超过一个月的项目：
    
    `LIST FROM #projects WHERE !completed AND file.ctime <= date(today) - dur(1 month)`

### 排序属性 sort
按一个或多个字段对所有结果进行排序。

`SORT date [ASCENDING/DESCENDING/ASC/DESC]`

您还可以提供多个字段作为排序依据。排序将基于第一个字段完成。然后，如果发生平局，则第二个字段将用于对并列字段进行排序。如果仍有平局，则第三种将解决它，依此类推。

`SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]`

### 分组依据 group

对字段上的所有结果进行分组。每个唯一字段值生成一行，该值具有 2 个属性：一个对应于要分组的字段，另一个数组字段包含所有匹配的页面。`rows`

`GROUP BY field GROUP BY (computed_field) AS name`

为了使数组的使用更容易，Dataview 支持字段"旋转"。如果您希望从数组中的每个对象获取字段，则将自动从 中的每个对象获取该字段，从而生成一个新数组。然后，可以像对生成的数组一样应用聚合运算符。`rows``test``rows``rows.test``test``rows``sum()`

### 扁平化 flatten

在每行中展平数组，在数组中的每个条目生成一个结果行。

`FLATTEN field FLATTEN (computed_field) AS name`

例如，将每个文献注释中的字段拼合为每位作者一行：`authors`

查询

`TABLE authors FROM #LiteratureNote FLATTEN authors`

### 显示条数 limit
将结果限制为最多 N 个值。

`LIMIT 5`

命令按照其写入顺序进行处理，因此以下命令在限制_后_对结果进行排序：

`LIMIT 5 SORT date ASCENDING`


### 例子

![[Pasted image 20221016235711.png]]

---

```dataview
table 领域, 方法, 理论, 技术, 项目, 作者, 时间, 学校, 参考价值
from "40 摘录"
where current-status = "41 文献,摘录"
sort 参考价值 desc
```

```dataview
list 
from  #设计生成 and "30 - 摘录"
sort 时间 desc
```



# 相关链接
[查询 - 数据视图 (blacksmithgu.github.io)](https://blacksmithgu.github.io/obsidian-dataview/query/queries/)

https://zhuanlan.zhihu.com/p/373623264