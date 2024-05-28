---
文件: "echarts"
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,Echarts]]| ▶️ **

🧩 标签: #echarts
🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸 

### 文件夹文件数量矩阵图

```dataviewjs

const pages =  dv.pages()
           .groupBy(p => p.file.folder)
           .sort(p=> p.rows.length)
           .map(p => ({name: p.key || "根目录", value: p.rows.length}))
           .array().reverse();
const colorList = ['#bb86a8', '#c39fbc', '#cab8d0', '#d2d0e3', '#d9e9f7'];
const datas = pages

const option = {
	title: {
          text: '文件夹文件数量矩阵图'
        },
    series: {
        type: 'treemap',
        itemStyle: {
            color: 'rgba(109, 40, 40, 1)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 0, 0)',
        },
        data: pages
        
    },
    type: 'basicTreemap',
};
app.plugins.plugins['obsidian-echarts'].render(option, this.container)
```

