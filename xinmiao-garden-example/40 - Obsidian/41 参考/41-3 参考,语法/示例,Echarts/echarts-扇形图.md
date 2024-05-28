**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,Echarts]]| ▶️ **

🧩 标签: #echarts
🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸 

# 扇形图
```dataviewjs
const data = []
app.vault.root.children.forEach((child)=>{
	if(child.path.split(".")[1] != "md"){
		//console.log(child.path)
		data.push({name: child.path, value: dv.pages(`"${child.path}"`).length})
	}
})

const options = {
  backgroundColor: 'transparent',
  title: {
    text: '根文件夹包含笔记数量',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#e7f3fd'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  visualMap: {
    show: false,
    min: 0,
    max: 50,
    inRange: {
      colorLightness: [1, 0]
    }
  },
  series: [
    {
      name: '笔记数量',
      type: 'pie',
      radius: '75%',
      center: ['50%', '50%'],
      data: data.sort(function (a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
	        color: '#f5e6ef'
      },
      labelLine: {
        lineStyle: {
          color: '#e7f3fd'
        },
        smooth: 0.2,
        length: 10,
        length2: 20
      },
      itemStyle: {
        color: '#e7f3fd',
        shadowBlur: 200,
        shadowColor: '#e7f3fd'
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      }
    }
  ]
};
app.plugins.plugins['obsidian-echarts'].render(options, this.container)
```
## 笔记数量
```dataviewjs
const data = []
app.vault.root.children.forEach((child)=>{
	if(child.path.split(".")[1] != "md"){
		//console.log(child.path)
		data.push({name: child.path, value: dv.pages(`"${child.path}"`).length})
	}
})

const options = {
    backgroundColor: '#fff',
    title: {
        text: '笔记数量',
        subtext: '2023',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 26
        }
    },
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        data: ['<10w', '10w-50w', '50w-100w', '100w-500w', '>500w']
    },
    series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['20%', '70%'],
        color: ['#fef9fc', '#f8f2fa', '#f2f3fb', ' #edf3fc', '#ffffff'],

        label: {
            normal: {
                position: 'inner',
                formatter: '{d}%',

                textStyle: {
                    color: '#924f7b',
                    fontWeight: 'bold',
                    fontSize: 14 
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: data
    }, {
        type: 'pie',
        radius: ['73%', '80%'],
        itemStyle: {
            normal: {
                color: '#f8edf4'
            },
            emphasis: {
                color: '#e7f3fd'
            }
        },
        label: {
            normal: {
                position: 'inner',
                formatter: '{c}个',
                textStyle: {
                    color: '#924f7b',
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        data: data
    }]
};
app.plugins.plugins['obsidian-echarts'].render(options, this.container)
```