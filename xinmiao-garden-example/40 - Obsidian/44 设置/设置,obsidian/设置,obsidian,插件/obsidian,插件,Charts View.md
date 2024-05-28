---
标题: obsidian,插件,Charts View
创建时间: 2022-10-24 16:38
修改时间: <%+ tp.file.last_modified_date() %>
标签: "obsidian插件" 
备注: 
其他:
作者: "千语鸟"
类型1: obsidian
tags: obsidian插件/图表
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

description :: 绘制图表

来源:: 

```


---
# 功能
绘制图表，不支持两组以上数据，只识别csv文件
不太好用
用于统计

# 使用
## 植入新表
### 创建命令栏
![[Pasted image 20221024204337.png]]
### 选择预览图表
![[Pasted image 20221024204552.png]]
### 数据输入

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Bar

#-----------------#
#- chart data    -#
#-----------------#
data:
  - action: "Browse the website"
    pv: 50000
  - action: "Add to cart"
    pv: 35000
  - action: "Generate orders"
    pv: 25000
  - action: "Pay order"
    pv: 15000
  - action: "Seal the deal"
    pv: 8500

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "pv"
  yField: "action"
  conversionTag: {}
```

x轴：pv
y轴：action

## 从CSV导入数据创建图表
### Excel表修改
1.表头名称修改，否则报错：
![[Pasted image 20221024213101.png]]
2.xlsx转csv格式
![[Pasted image 20221024212144.png]]
### 创建命令栏
Ctrl+p，输入cha
![[Pasted image 20221024212637.png]]
### 选择导入的文件
![[Pasted image 20221024212736.png]]
生成图表
![[Pasted image 20221024213003.png]]

## 统计

![[Pasted image 20221024213808.png]]
![[Pasted image 20221024213740.png]]

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "folder"
  yField: "count"
  padding: auto
  label:
    position: "middle"
    style:
      opacity: 0.6
      fontSize: 12
  columnStyle:
    fillOpacity: 0.5
    lineWidth: 1
    strokeOpacity: 0.7
    shadowColor: "grey"
    shadowBlur: 10
    shadowOffsetX: 5
    shadowOffsetY: 5
  xAxis:
    label:
      autoHide: false
      autoRotate: true
  meta:
    count:
      alias: "Count"
```

隐藏标签

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "folder"
  yField: "count"
  padding: auto
  label:
    position: "middle"
    style:
      opacity: 0.6
      fontSize: 12
  columnStyle:
    fillOpacity: 0.5
    lineWidth: 1
    strokeOpacity: 0.7
    shadowColor: "grey"
    shadowBlur: 10
    shadowOffsetX: 5
    shadowOffsetY: 5
  xAxis:
    label:
      autoHide: true
      autoRotate: true
  meta:
    count:
      alias: "Count"
```

## 创建时间-历史
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#


data: |
  dataviewjs:
  return dv.pages().groupBy(p => p.file.cday.toFormat("yyyy/MM")).map(p => ({cdate: p.key, count: p.rows.length})).array();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "cdate"
  yField: "count"
  padding: auto
  color: "#f2be45"
  label:
    position: "middle"
    style:
      opacity: 0.6
      fontSize: 12
  columnStyle:
    fillOpacity: 0.5
    lineWidth: 1
    strokeOpacity: 0.7
    shadowColor: "grey"
    shadowBlur: 10
    shadowOffsetX: 5
    shadowOffsetY: 5
  xAxis:
    label:
      autoHide: false
      autoRotate: true
  meta:
    count:
      alias: "文件数量"
```

---
## 文件夹/文件数量
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "folder"
  yField: "count"
  padding: auto
  color: "#00e09e"
  label:
    position: "middle"
    style:
      opacity: 0.6
      fontSize: 12
  columnStyle:
    fillOpacity: 0.5
    lineWidth: 1
    strokeOpacity: 0.7
    shadowColor: "grey"
```


## 标签云-词频统计-样式1
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: WordCloud

#-----------------#
#- chart data    -#
#-----------------#

data: | 
  dataviewjs: 
  return (() => {
    const tags = this.app.metadataCache.getTags();
   
    let dataArray = [];
    Object.keys(tags).forEach(key => dataArray.push ({tag: key.replace("#",""),count: tags[key]}));
    return dataArray.filter(p => !p.tag.includes("<")&&!p.tag.includes(">"));
   })();


#-----------------#
#- chart options -#
#-----------------#
options:
  wordField: "tag"
  weightField: "count"
  color: "#9c5333"
  wordStyle:
    fontFamily: "Verdana"
    fontSize: [24, 80]
  interactions:
    type: "element-active"
  style:
    backgroundColor: "translucent"
  state:
    active:
      style:
        lineWidth: 3
```

## 标签云-词频统计--样式2
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: WordCloud

#-----------------#
#- chart data    -#
#-----------------#
data: | 
  dataviewjs: 
  return (() => {
    const tags = this.app.metadataCache.getTags();
   
    let dataArray = [];
    Object.keys(tags).forEach(key => dataArray.push ({tag: key.replace("#",""),count: tags[key]}));
    return dataArray;
   })();


#-----------------#
#- chart options -#
#-----------------#
options:
  wordField: "tag"
  weightField: "count"
  colorField: "tag"

#-----------------------------------------------#
#--- 可选择多彩颜色(colorField) 或单色 (color) ---#
#---  colorField: "tag" ---#
#---  color: "#e6b422" ---#
#-----------------------------------------------#

  wordStyle:
    rotation: 0

```
---
## 柱状图-文件数量
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "folder"
  yField: "count"
  padding: auto
 
  columnStyle:
    fillOpacity: 1
    lineWidth: 0.9
    strokeOpacity: 1.7
    shadowColor: "grey"
    shadowBlur: 5
    shadowOffsetX: 5
    shadowOffsetY: 5

  meta:
    count:
      alias: "文件数量" 
```
---

## 笔记数量排行榜-文件数量

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Bar

#-----------------#
#- chart data    -#
#-----------------#
data: | 
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .sort(p => p.rows.length)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}) )
           .array()
           .reverse();

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "count"
  yField: "folder"
  padding: auto
  height: 500

  meta:
    count:
      alias: "数量"
```

---

## 饼状图-文件数量

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Pie

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
           .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  angleField: "count"
  colorField: "folder"
  radius: 1
  label:
    type: "spider"
    content: "{percentage}\n{name}"
  legend:
    layout: "horizontal"
    position: "bottom"
```


---

## 雷达图-书籍类型
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Radar

#-----------------#
#- chart data    -#
#-----------------#
data:
  - item: "马列主义"
    user: "a"
    score: 2
  - item: "哲学"
    user: "a"
    score: 65
  - item: "社会科学总论"
    user: "a"
    score: 10
  - item: "政治、法律"
    user: "a"
    score: 4
  - item: "军事"
    user: "a"
    score: 2
  - item: "经济"
    user: "a"
    score: 10
  - item: "文化教育"
    user: "a"
    score: 28
  - item: "语言文字"
    user: "a"
    score: 14
  - item: "文学"
    user: "a"
    score: 20
  - item: "艺术"
    user: "a"
    score: 0	
  - item: "历史地理"
    user: "a"
    score: 9
  - item: "自然科学总论"
    user: "a"
    score: 1
  - item: "数理化"
    user: "a"
    score: 0
  - item: "天文地球"
    user: "a"
    score: 3
  - item: "生物"
    user: "a"
    score: 3
  - item: "医药卫生"
    user: "a"
    score: 3
  - item: "农业"
    user: "a"
    score: 4
  - item: "工业"
    user: "a"
    score: 11
  - item: "交通"
    user: "a"
    score: 1
  - item: "航空航天"
    user: "a"
    score: 1
  - item: "环境安全"
    user: "a"
    score: 0
  - item: "综合"
    user: "a"
    score: 1

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: "item"
  yField: "score"
  seriesField: ""
  color: "#ff461f"
  meta:
    score:
      alias: "Score"
      min: 0
      nice: true
  xAxis:
    line: null
    tickLine: null
  yAxis:
    label: false
    grid:
      alternateColor: "rgba(0, 0, 0, 0.04)"
  point: {}
  area: {}
```

## 混合折线图-温度-假数据
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Mix

#-----------------#
#- chart data    -#
#-----------------#
data.area:
  - time: 1246406400000
    temperature: [14.3, 27.7]
  - time: 1246492800000
    temperature: [14.5, 27.8]
  - time: 1246579200000
    temperature: [15.5, 29.6]
  - time: 1246665600000
    temperature: [16.7, 30.7]
  - time: 1246752000000
    temperature: [16.5, 25.0]
  - time: 1246838400000
    temperature: [17.8, 25.7]

data.line:
  - time: 1246406400000
    temperature: 21.5
  - time: 1246492800000
    temperature: 22.1
  - time: 1246579200000
    temperature: 23
  - time: 1246665600000
    temperature: 23.8
  - time: 1246752000000
    temperature: 21.4
  - time: 1246838400000
    temperature: 21.3

#-----------------#
#- chart options -#
#-----------------#
options:
  appendPadding: 8
  syncViewPadding: true
  tooltip:
    shared: true
    showMarkers: false
    showCrosshairs: true
    offsetY: -50

options.area:
  axes: {}
  meta:
    time:
      type: 'time'
      mask: 'MM-DD'
      nice: true
      tickInterval: 172800000
      range: [0, 1]
    temperature:
      nice: true
      sync: true
      alias: '温度范围'
  geometries:
    - type: 'area'
      xField: 'time'
      yField: 'temperature'
      mapping: {}

options.line:
  axes: false
  meta:
    time:
      type: 'time'
      mask: 'MM-DD'
      nice: true
      tickInterval: 172800000
      range: [0, 1]
    temperature:
      sync: 'temperature'
      alias: '温度'
  geometries:
    - type: 'line'
      xField: 'time'
      yField: 'temperature'
      mapping: {}
    - type: 'point'
      xField: 'time'
      yField: 'temperature'
      mapping:
        shape: 'circle'
        style:
          fillOpacity: 1
```

## 折线图-假数据

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: TinyLine

#-----------------#
#- chart data    -#
#-----------------#
data: [0, 64, 417, 438, 887, 309, 397, 0, 550, 575, 563, 430, 525, 592, 492, 0, 467, 513, 546, 983, 340, 539, 243, 226, 192]

#-----------------#
#- chart options -#
#-----------------#
options:
  height: 400 
  autoFit: true
  smooth: false
  tooltip: true
  annotations:
    - type: "line"
      start: ["min", "mean"]
      end: ["max", "mean"]
      style:
        stroke: "rgba(0, 0, 0, 0.45)"
      text:
        content: "Average 平均值"
        offsetY: -2
        style:
          textAlign: "left"
          fontSize: 10
          fill: "rgba(44, 53, 66, 0.45)"
          textBaseline: "bottom"
    - type: "line"
      start: ["min", 800]
      end: ["max", 800]
      style:
        stroke: "rgba(200, 0, 0, 0.55)"
      text:
        content: "Target 目标值"
        offsetY: -2
        style:
          textAlign: "left"
          fontSize: 10
          fill: "rgba(44, 53, 66, 0.45)"
          textBaseline: "bottom"
```
---

## 树形构架图
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: OrganizationTreeGraph

#-----------------#
#- chart data    -#
#-----------------#
data:
  id: "root"
  label: "Root"
  children:
    - id: "c1"
      label: "C1"
      children:
        - id: "c1-1"
          label: "C1-1"
          children:
            - id: "c1-1-1"
              label: "C1-1-1"
            - id: "c1-1-2"
              label: "C1-1-2"
        - id: "c1-2"
          label: "C1-2"
          children:
            - id: "c1-2-1"
              label: "C1-2-1"
            - id: "c1-2-2"
              label: "C1-2-2"
    - id: "c2"
      label: "C2"
      children:
        - id: "c2-1"
          label: "C2-1"
          children:
            - id: "c2-1-1"
              label: "C2-1-1"

#-----------------#
#- chart options -#
#-----------------#
options: {}
```
---

假数据

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: DualAxes

#-----------------#
#- chart data    -#
#-----------------#
data:
  -
    - time: "2019-03"
      value: 350
      count: 800
    - time: "2019-04"
      value: 900
      count: 600
    - time: "2019-05"
      value: 300
      count: 400
    - time: "2019-06"
      value: 450
      count: 380
    - time: "2019-07"
      value: 470
      count: 22
  -
    - time: "2019-03"
      value: 350
      count: 800
    - time: "2019-04"
      value: 900
      count: 600
    - time: "2019-05"
      value: 300
      count: 400
    - time: "2019-06"
      value: 450
      count: 380
    - time: "2019-07"
      value: 470
      count: 22

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: 'time'
  yField: ['value', 'count']
  yAxis:
    value:
      min: 0
      label:
        formatter:
          function formatter(val) {
            return ''.concat(val, '个');
          }
  geometryOptions:
    - geometry: 'column'
    - geometry: 'line'
      lineStyle:
        lineWidth: 2
```

## bar 条形图

```chart
type: bar
labels: [w,u,t,q,g,s,d]
series:
  - title: aa
    data: [43,2,31,14,5,66,17,8,9]
  - title: bb
    data: [12,33,12,44,13,55,32,12]
  - title: cc
    data: [12,23,34,1,88,99,21,88]
tension: 0.51
width: 80%
labelColors: true
fill: true
beginAtZero: true
```
---
## line 线图

```chart
type: line
labels: [w,u,t,q,g,s,d]
series:
  - title: aa
    data: [43,2,31,14,5,66,17,8,9]
  - title: bb
    data: [12,33,12,44,13,55,32,12]
  - title: cc
    data: [12,23,34,1,88,99,21,88]
tension: 0.51
width: 80%
labelColors: true
fill: true
beginAtZero: true
```
---

## pie 饼图

```chart
type: pie
labels: [w,u,t,q,g,s,d]
series:
  - title: aa
    data: [43,2,31,14,5,66,17,8,9]
tension: 0.51
width: 80%
labelColors: true
fill: true
beginAtZero: true
```
---

## doughnut 甜甜圈

```chart
type: doughnut
labels: [q,w,e,r,t]
series:
  - title: a
    data: [21,3,24,54,23]
tension: 0.43
width: 80%
labelColors: true
fill: false
beginAtZero: true
```
---

## radar 雷达图
```chart
type: radar
labels: [a,s,d,f,g,h,j,k]
series:
  - title: ttt
    data: [12,33,44,55,6,78,9,99]
tension: 0.2
width: 80%
labelColors: true
fill: true
beginAtZero: true

```
---

## polarArea 面积图
```chart
type: polarArea
labels: [a,s,d,f,g,h,j,k]
series:
  - title: ttt
    data: [12,33,44,55,6,78,9,99]
tension: 0.2
width: 80%
labelColors: true
fill: true
beginAtZero: true

```
---

---