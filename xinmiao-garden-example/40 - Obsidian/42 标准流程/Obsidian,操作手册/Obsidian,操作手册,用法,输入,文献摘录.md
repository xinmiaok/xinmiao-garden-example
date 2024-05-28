---
标题: Obsidian,操作手册,用法,输入,文献摘录
创建时间: 2023-07-23 17:41
修改时间: <%+ tp.file.last_modified_date() %>
tags: 
类型1: 
用途: 模板
---
**◀️ [[Obsidian,操作手册]]| 📎** 

🧩 标签: #软件 #笔记 #写作
🪁 status: #🔖 
🎏 class: #📸 

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

**◀️ 父节点| ▶️ 子节点** 
description :: 

来源:: 
- [Zotero GPT 辅助文献阅读方法论 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/625188310)
- [obsidian 我眼中最好的插件搭配 | 打造个性化知识库 | 完整学术工作流 | dataview/metadata/cmenu/quickadd -v2_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1tL4y1H7XJ/?spm_id_from=333.337.search-card.all.click&vd_source=5f738d98a287c1460eaef235b3405efd)
- [在Obsidian里使用Metadata Menu插件实现Tana的超级标签（Supertags）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1sd4y1w7ia/?spm_id_from=333.337.search-card.all.click&vd_source=5f738d98a287c1460eaef235b3405efd)

```




### 标签设置
[[obsidian,方法,标签]]实现对文献字段的分类，笔记的应用方向


## 文献收集
**插件安装及使用：**
- [[zotero#英文文献批量下载]]
- [[zotero#中文文献下载：茉莉花]]

### 1.查找大类文献
[IEEE Xplore](https://ieeexplore.ieee.org/Xplore/home.jsp)选择文章下载到Zotero的文件夹
- ![[Pasted image 20230723223811.png]]
- 考虑**引用量、期刊、年份**
- ![[Pasted image 20230724100045.png]]
- **没有收敛到很细节问题的、综述性较强**的文献：complex system
- 根据知识需求选择相关文献：
	- 偏向理论、方法、技术、研究进展、研究背景、研究空白？





### 2.文献分类
### 3.查找特定方向的文章
## 文献整理
### Obsidian与Zotero联动
[个人分享：Obsidian 联动 Zotero_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1W24y1Y7is/?spm_id_from=333.999.list.card_archive.click&vd_source=5f738d98a287c1460eaef235b3405efd)

#citation
![[Pasted image 20230607180229.png]]

#### 抓取元数据：Better BibTex、citation

##### Zotero：Better BibTex

- 用于：论文笔记及元数据导出
- 插件地址：[GitHub - retorquere/zotero-better-bibtex: Make Zotero effective for us LaTeX holdouts](https://github.com/retorquere/zotero-better-bibtex)
- 下载
	- 点击Lastest按钮![[Pasted image 20230607142909.png]]
	- 点击.xpi文件下载![[Pasted image 20230607143147.png]]
- 安装：
	- 打开Zotero，工具-插件![[Pasted image 20230607143536.png]]
	- 弹出对话框中点击齿轮按钮-选择从文件中安装选项![[Pasted image 20230607143810.png]]
	- 选中插件进行安装![[Pasted image 20230607143910.png]]![[Pasted image 20230607144029.png]]![[Pasted image 20230607144201.png]]
	- 重启![[Pasted image 20230607144237.png]]

###### 配置

==配置==
- 1.编辑-首选项
	- ![[Pasted image 20230607144432.png]]
	- ![[Pasted image 20230607144601.png]]
- 2.在obsidian中新建用于存放文献元数据的文件夹，可放置到个人配置的文件夹中!
	- ![[Pasted image 20230607153935.png]]
-  3.在Zotero中右键我的文库-导出文献库!
	- ![[Pasted image 20230607154111.png]]
	- ==勾选保持更新==以便更新后续添加的文献条目![[Pasted image 20230607154532.png]]
	- 保存到元数据的存储文件夹中![[Pasted image 20230607160415.png]]
- 4.查看生成相应的.bib文件
	- ![[Pasted image 20230607160538.png]]
	- 如果不能查看文件，需要在设置-文件与链接中打开检测所有文件类型![[Pasted image 20230607161017.png]]

##### obsidian：citation
[[obsidian,插件,citation]]
###### 配置
下载，安装citation插件后启用，进行==配置==
- 文献元数据存放路径：40 - Obsidian/附件/附件,文献,元数据/我的文库.bib
- 文献笔记暂时存放路径：30 - 摘录/31 摘录,文献/阅读文献
- ![[Pasted image 20230607162235.png]]
- 模板的元数据配置，用entry变量对元数据进行扩展![[Pasted image 20230607162429.png]]
- 用于提取Zotero中的元数据![[Pasted image 20230607162944.png]]

###### 创建笔记
1.Ctrl+Shift+O，选择相应文献创建笔记
![[Pasted image 20230607171553.png]]
2.时间设置上使用Template插件，进行配置
- ![[Pasted image 20230607173818.png]]
- ![[Pasted image 20230607174636.png]]
3.结果
- ![[Pasted image 20230607174804.png]]
- ![[Pasted image 20230607175206.png]]
- ![[Pasted image 20230607175302.png]]
- ![[Pasted image 20230607175406.png]]
- ![[Pasted image 20230607175508.png]]
- ![[Pasted image 20230607175547.png]]

#### 添加标签：MarkDB Connect
![[Pasted image 20230607175658.png]]
 
下载安装
- 插件下载地址：[GitHub - daeh/zotero-markdb-connect](https://github.com/daeh/zotero-markdb-connect)
- 下载页面，选择xpi格式下载![[Pasted image 20230607202013.png]]
- 安装：工具-附加组件![[Pasted image 20230607201015.png]]![[Pasted image 20230607201626.png]]
- ![[Pasted image 20230607202813.png]]
- ![[Pasted image 20230607203009.png]]
- 重启Zotero

配置
- ![[Pasted image 20230607203706.png]]
- 设置在obsidian存储文献的目录
	- D:\BaiduSyncdisk\Research\Xinmiao\40 - Obsidian\附件\附件,文献
	- ![[Pasted image 20230607211007.png]]
	- ![[Pasted image 20230607215035.png]]
	- ![[Pasted image 20230607215253.png]]
	- ![[Pasted image 20230607211536.png]]
- 添加标签
	- ![[Pasted image 20230607215929.png]]
	- ![[Pasted image 20230607211536.png]]
	- ![[Pasted image 20230607220326.png]]
- 分配标签颜色
	- ![[Pasted image 20230607220506.png]]![[Pasted image 20230607220653.png]]
- 右键文献，显示Markdown文件，选择obsidian![[Pasted image 20230607220959.png]]![[Pasted image 20230607222324.png]]
- 文件跳转![[Pasted image 20230607222411.png]]

---

## 文献摘录
**相关模板：**[[模板,摘录,文献]] |  [[模板,摘录,文献,主题,索引]]
### 文献卡片创建
Ctrl+Shift+O，选择相应文献创建笔记，模板已经配置好了

### 文献索引创建
[[文献索引,复杂系统]] | [[文献索引,设计生成]]