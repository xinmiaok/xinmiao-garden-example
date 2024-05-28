---
cssClasses: zettelkasten
---

**◀️ [[40 - Obsidian]]>[[44 设置]]>[[设置,obsidian]]| ▶️ **

🧩 标签:  
🪁 status: #🎄
🎏 class: #🖇️

````ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

description:: 为了达到快速引用、聚合相关内容、形成完整的思维流程、项目管理、个人信息管理的目的，提出了00-70的文件夹结构。同时引入标签、字段，结合内容地图和主页形成检索的页面；引入双链作为节点之间的连接，形成具有不同连接程度节点的笔记网络。

笔记内容来源：
	- [oldwinter/knowledge-garden: 我的第二大脑 second brain，我的数字花园 digital garden，用obsidian双链笔记软件写作而成 (github.com)](https://github.com/oldwinter/knowledge-garden)
	- [bramses/bramses-highly-opinionated-vault-2023: A highly opinionated, fully featured Obsidian vault that can get you from Zero to Zettelkasten lickety split! (github.com)](https://github.com/bramses/bramses-highly-opinionated-vault-2023)
	- [Chens_LMS_Public_CN/docs/docs/index.md at main · laozhou-in-germany/Chens_LMS_Public_CN (github.com)](https://github.com/laozhou-in-germany/Chens_LMS_Public_CN/blob/main/docs/docs/index.md)
	- [11-check-it-out/KGnotes-Demo-EN: An English demo vault of KG notes (github.com)](https://github.com/11-check-it-out/KGnotes-Demo-EN)

````

````ad-todo
title: **快速访问**
collapse: open
color: 233, 243, 242
```dataview
table description, file.size, file.ctime, file.mtime
from "40 - Obsidian/44 设置/设置,obsidian/obsidian,设置,笔记组织方法"
```
````


结构：融合自上而下和自下而上
- **类型**
	- 自下而上：双链、内容地图
	- 自上而下：文件夹、主页笔记
	- 两者之间：标签、字段
- **影响**
	- 自上而下受到自下而上的影响，涌现的主要节点促进新的文件夹产生
	- 自下而上由于自上而下逻辑设定的易于定位

## 多维度的属性
结合[[PARA]]、[[obsidian,方法,MOC]]等方法，将各方法提到的分类作为笔记不同的属性，分别取不同的值
**obsidian 的六种工具**  
主页笔记、内容地图、直接链接、邻近度、标签和文件夹  
- **主页笔记（A Home Note）：**「卡片盒子」或是数字资料库的最高级，主要内容地图以及最相关的标签的链接
	- 笔记的汇总
	- 如[[00. 主页]]，作用：专注自认为重要的生活领域
- **内容地图（[[obsidian,方法,MOC]]）：** 索引
	- 笔记的索引、关联
	- 通过检索——表格、卡片实现
	- [[obsidian,方法,MOC]]，文件类型：==索引==
**实现方式：** 标签、Yaml、[[obsidian,插件,dataview]]  
- **直接链接（[[obsidian,方法,双链|Direct Links]]）**：最强有力的关联类型，是连接两个笔记之间最纯粹且最明确的方式。
	- 笔记的连接
	- 双向链接体现了节点链接程度，主要的节点链接网状结构，符合[[无标度网络]]的特点
- **标签（[[obsidian,方法,标签|tags]]）：** 相对弱的关联，过滤大量笔记，属性设定，定位笔记
	- 笔记的分解
	- **内容设定**： [[obsidian,方法,标签|如何使用标签]]
- **邻近度（Proximity排序）** 灵活的关联
	- 排序
- **文件夹（Folder）：** 固定的、强制的等级秩序，不利于跨类别思考，定位笔记，是一种分解的操作
	- 笔记的切分，类似于房间

---

### 邻近度-排序
**组织方式的层级**
- **1.在主文件夹中按邻近度组织** 
	- 按字母顺序：不利于英文的近似含义的关联
	- 按时间排序：如果按照你创建日期排序，笔记之间的邻近度不会改变，但是除了时间上下文（temporal context）关系根据上下文决定了不同的价值，在本质上它们更随心所欲（随机）。
- **2.在同一子文件夹中按邻近度组织：**
	- 因为被分配在同一邻近区域，同一子文件夹中的笔记会有更加紧密的关联。但这样做的代价是与资料库的其他部分隔离开来。
- **3. 在内容地图中按邻近度组织：**
	- 同一内容地图中的笔记很有可能是密切相关的，特别是在它们以某种形式确定关系定位，并进行人工排序之后。这是==应用邻近度力量的最佳方式==。

---

## 场景化表达
 #PARA #记录/设置/自上而下

- *[[PARA]]*
- ![[主页,PARA]]


### 关联文件夹
Archive：
- **场景·花园：** 背景地图（[[50 - 知识卡片]]）
Area：
- **场景·书房：** [[60 - 知识体系]]
Resource：
- **配置·工具：** [[40 - Obsidian]] 
- **参照·材料：** [[30 - 摘录]] 
Project
- **物品·logo：** 标识|[[00 - 计划记录]] 
- **人物：** [[10 - 人员管理]]
- **行为：** [[20 - 流]]
- **路径：** [[70 - 构思演化]]

## 系统：输入-体系-输出
#### 关联笔记
- **输入：** Project|人物 [[10 - 人员管理]]·行为[[20 - 流]]·材料
	- - 涉及的笔记类型：[[obsidian,笔记,摘录笔记|摘录笔记]]
- **体系：** 
	- 分解·[[30 - 摘录]]|联系+归纳·[[70 - 构思演化]]]|体系·[[60 - 知识体系]]·[[50 - 知识卡片]]·[[40 - Obsidian]]
	- 涉及的笔记类型：[[obsidian,笔记,卡片笔记|卡片笔记]]、[[obsidian,笔记,常青笔记|常青笔记]]
- **体系：** 输出|项目的成果
	- 涉及的笔记类型：[[obsidian,笔记,常青笔记|常青笔记]]
---

# 过程
- [[2023年09月25日#Memo]]提到*场景化的表达*
- [[2023年09月30日]]

*参考链接*
- [Nick Milo：如何在笔记之间形成有效的关联？ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/373862260?utm_id=0)