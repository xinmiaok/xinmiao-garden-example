---
u: "[[设置,obsidian,插件]]"
d:
j: 
类型1: obsidian
类型2: 插件
类型3: 语法
---

**◀️ [[40 - Obsidian]]>[[42 标准流程]]>| ▶️📎 **  

🧩 标签:  #编程/MD/语法 
🪁 status: #🏷️
🎏 class: #🖇️

## dataview 基础语法

> 数据来源：from  + 标签/“文件夹"/链接/外链
>- `from` 指的是从哪里获取数据，可以从 `#tag` 标签获取、 从 `folder` 文件夹获取、从 `[[link]]` 链接获取，或者从链接了 link 的文件获取 `outgoing([[link]])` ；

> 条件表达：where + 表达 + 条件(针对yalm部分)
>- `where` 指的是上边获取的数据，要符合怎样的规则，也就是筛选；

> 排序：sort 表头 desc（降序）/asc（升序）
> - `sort` 指的是排序，默认升序。

一个标准的语法是这样的：

````
```dataview
list|table|task|calendar // 任选一个类型
from // 紧跟设置数据来源
where // 数据筛选
sort // 排序规则
group //分组规则
limit //显示条目
```
````

### 结构
```data view
[list|table|task] field1, ... , field
from #tag or "folder" or [[link]] or outgoing([[link]])
where field [>|>=|<|<=|=|&|'|']
sort field [ascending|descending|asc|desc]
```

yalm 语言部分放到笔记的起始位置，起始结尾三个短横线
放到中间写成
表头:: 表头内容

### 可操作的字段
#### 页面-隐式字段

Dataview 会自动向每个页面添加大量元数据：

-   `file.name`：文件标题（字符串）。
-   `file.folder`：此文件所属文件夹的路径。
-   `file.path`：完整的文件路径（字符串）。
-   `file.link`：指向文件的链接（链接）。
-   `file.size`：文件的大小（以字节为单位）（数字）。
-   `file.ctime`：文件的创建日期（日期 + 时间）。
-   `file.cday`：文件的创建日期（只是一个日期）。
-   `file.mtime`：上次修改文件的日期（日期 + 时间）。
-   `file.mday`：上次修改文件的日期（只是一个日期）。
-   `file.tags`：注释中所有唯一标记的数组。子标记按每个级别细分，因此将作为 存储在数组中。`#Tag/1/A``[#Tag, #Tag/1, #Tag/1/A]`
-   `file.etags`：注释中所有显式标记的数组;与 不同，不包含子标记。`file.tags`
-   `file.inlinks`：指向此文件的所有传入链接的数组。
-   `file.outlinks`：此文件中的所有传出链接的数组。
-   `file.aliases`：笔记的所有别名的数组。
-   `file.tasks`：此文件中所有任务（即 ）的数组。`- [ ] blah blah blah`

如果文件的标题（形式或 ）内有日期，或者具有字段/内联字段，则它还具有以下属性：`yyyy-mm-dd``yyyymmdd``Date`

-   `file.day`：与文件关联的显式日期。

#### 任务-隐式字段

与页面一样，Dataview 会向每个任务添加许多隐式字段：

-   任务从其父页面继承_所有字段_ - 因此，如果您的页面中有一个字段，您也可以在任务中访问该字段。`rating`
-   `completed`：此_特定_任务是否已完成;这不考虑任何子任务的完成/未完成。
-   `fullyCompleted`：此任务及其**所有**子任务是否已完成。
-   `text`：此任务的文本。
-   `line`：此任务显示的行。
-   `path`：此任务所在的文件的完整路径。
-   `section`：指向包含此任务的部分的链接。
-   `link`：指向此任务附近最近的可链接块的链接;对于创建指向任务的链接很有用。
-   `subtasks`：此任务的任何子任务。
-   `real`：如果这是真的，这是一个真正的任务;否则，它是任务上方/下方的列表元素。
-   `completion`：任务完成的日期。如果未添加注释，则默认为文件修改时间。
-   `due`：任务到期的日期（如果有）。
-   `created`：任务的创建日期。如果未添加注释，则默认为文件创建时间。
-   `annotated`：如果任务具有任何自定义批注，则为 true，否则为 false。

## 显示形式 /查询类型
### 列表查询 list

语法

`LIST FROM <source>`

查询

`LIST FROM #games/mobas OR #games/crpg`

#### 没有 ID 的列表

如果不希望在列表视图中包含文件名/组键，可以使用：`LIST WITHOUT ID`

语法

`LIST WITHOUT ID <expression> FROM <source>`

查询

`LIST WITHOUT ID file.path FROM "4. Archive"`

### 表查询 table

表支持页面数据的表格视图。您可以通过提供要呈现的 YAML 前端字段的逗号分隔列表来构造表，如下所示：

`TABLE file.day, file.mtime FROM <source>`

您可以使用以下语法选择标题名称来呈现计算字段：`AS`

`TABLE (file.mtime + dur(1 day)) AS next_mtime, ... FROM <source>`

#### 不带 ID 的表

如果您不希望输出中使用默认的"文件"或"组"字段（替换它或因为它不需要），则可以使用：`TABLE WITHOUT ID`

查询

`TABLE WITHOUT ID time-played AS "Time Played", length AS "Length", rating AS "Rating" FROM #game SORT rating DESC`

### 任务查询 task

语法

`TASK FROM <source>`

查询

`TASK FROM "dataview"`

### 日历查询 calendar

日历视图在日历视图中呈现与查询匹配的所有页面，使用给定的日期表达式选择要在其上呈现页面的日期。

语法

`CALENDAR <date> FROM <source>`

查询

`CALENDAR file.mtime FROM "dataview"`

任务视图呈现其页面与给定谓词匹配的所有任务。

语法

`TASK FROM <source>`

查询

`TASK FROM "dataview"`
