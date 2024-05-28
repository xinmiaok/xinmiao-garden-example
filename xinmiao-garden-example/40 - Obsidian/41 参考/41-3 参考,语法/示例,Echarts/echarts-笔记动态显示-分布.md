---
文件: "echarts"
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,Echarts]]| ▶️ **

🧩 标签: #echarts
🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸 

```dataviewjs
 let pages= dv.pages()
           .groupBy(p => p.file.cday.toFormat("yyyy-MM"))
           .map(p => ({cday: p.key , count: p.rows.length,wordcout:p.rows.values}))
           .array();
  function sumItem(arr1, arr2) {
            if (arr2.length == 0) {
                return arr1;
            } else {
                arr1.map(function(value, index) {
                    arr2[index] += value;
                })
            }
            return arr2;
        }

const xData = []
const yData = []
const y2Data = []

pages.forEach((page)=>{
	xData.push(page.cday)
	yData.push(page.count)
	y2Data.push(page.wordcout)
})
 let wordscout=[]
 let num =0
	for (let i = 0; i < y2Data.length; i++) {
		for (let j = 0; j < y2Data[i].length; j++) {
				num+=Number(y2Data[i][j].file.size)	
		}
	wordscout[i]=parseInt((num/3)/8)
	}
const y3Data =sumItem(yData,wordscout)
console.log(y3Data)

let option = {
   backgroundColor: "#344b58",
  title: {
    text: "笔记数量和大小统计",
    subtext: "BY Cuman",
    x: "4%",

    textStyle: {
      color: "#fff",
      fontSize: "22",
    },
    subtextStyle: {
      color: "#90979c",
      fontSize: "16",
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      textStyle: {
        color: "#fff",
      },
    },
  },
  grid: {
    borderWidth: 0,
    top: 110,
    bottom: 95,
    textStyle: {
      color: "#fff",
    },
  },
  legend: {
    x: "4%",
    top: "8%",
    textStyle: {
      color: "#90979c",
    },
    data: ["字数", "大小", "总和"],
  },

  calculable: true,
  xAxis: [
    {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#90979c",
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitArea: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
      data: xData,
    },
  ],
  yAxis: [
    {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#90979c",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
      splitArea: {
        show: false,
      },
    },
  ],
  dataZoom: [
    {
      show: true,
      height: 30,
      xAxisIndex: [0],
      bottom: 30,
      start: 10,
      end: 80,
      handleIcon:
        "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
      handleSize: "110%",
      handleStyle: {
        color: "#d3dee5",
      },
      textStyle: {
        color: "#fff",
      },
      borderColor: "#90979c",
    },
    {
      type: "inside",
      show: true,
      height: 15,
      start: 1,
      end: 35,
    },
  ],
  series: [
    {
      name: "笔记体积",
      type: "bar",
      stack: "总量",
      barMaxWidth: 35,
      barGap: "10%",
      itemStyle: {
        normal: {
          color: "rgba(255,144,128,1)",
          label: {
            show: true,
            textStyle: {
              color: "#fff",
            },
            position: "inside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
        },
      },
      data: wordscout,
    },
    {
      name: "笔记数量",
      type: "bar",
      stack: "总量",
      itemStyle: {
        normal: {
          color: "rgba(0,191,183,1)",
          barBorderRadius: 0,
          label: {
            show: true,
            position: "outside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
        },
      },
      data: yData,
    },

    {
      name: "总数",
      type: "line",
      symbolSize: 10,
      symbol: "circle",
      itemStyle: {
        normal: {
          color: "rgba(252,230,48,1)",
          barBorderRadius: 0,
          label: {
            show: false,
            position: "top",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
        },
      },
      data: y3Data,
    },
  ],
};

app.plugins.plugins['obsidian-echarts'].render(option, this.container)

```