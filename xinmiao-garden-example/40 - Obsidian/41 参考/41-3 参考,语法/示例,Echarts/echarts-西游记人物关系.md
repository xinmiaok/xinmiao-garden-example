---
文件: "echarts"
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,Echarts]]| ▶️ **

🧩 标签: #echarts
🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸 

> [!info]
> 如果存在人物对应名称的笔记可以自动关联，点击即可跳转


```dataviewjs
const echarts = app.plugins.plugins['obsidian-echarts'].echarts()
let option = {
    title: {
        text: '西游记人物关系图',
    },
    legend: {},
    series: [
        {
            type: 'graph', // 类型:关系图
            layout: 'force',
            legendHoverLink: true,
            symbolSize: 70,
            zoom: 0.13,
            force: {
                // initLayout: 'circular'
                // gravity: 0
                repulsion: 1500,
                edgeLength: 10,
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: 5,
            draggable: true,
            legend: [{ name: '取经团队' }, { name: '妖怪' }, { name: '神仙' }, { name: '凡人' }, { name: '地点' }],
            label: {
                show: true,
                position: 'inside',
                // color: 'inherit',
                // fontStyle:'oblique', // 字体风格
                fontFamily: 'Arial', //字体系列
                fontSize: 10,
                formatter: '{b}',
            },
            edgeLabel: {
                // show: true,
                position: 'middle',
                formatter: function (x) {
                    return x.data.name;
                },
                fontSize: 10,
            },
            roam: 'scale',
            // roma: true,
            categories: [{ name: '取经团队' }, { name: '妖怪' }, { name: '神仙' }, { name: '凡人' }, { name: '地点' }],
            data: [
                {
                    name: '黄袍怪',
                    category: '妖怪',
                },
                {
                    name: '盘丝岭盘丝洞',
                    category: '地点',
                },
                {
                    name: '直健',
                    category: '凡人',
                },
                {
                    name: '碗子山波月洞',
                    category: '地点',
                },
                {
                    name: '祭赛国国王',
                    category: '凡人',
                },
                {
                    name: '禄星',
                    category: '神仙',
                },
                {
                    name: '福星',
                    category: '神仙',
                },
                {
                    name: '秦叔宝',
                    category: '凡人',
                },
                {
                    name: '火焰山',
                    category: '地点',
                },
                {
                    name: '紫阳真人',
                    category: 'NULL',
                },
                {
                    name: '纠察灵官',
                    category: '神仙',
                },
                {
                    name: '铁扇公主',
                    category: '妖怪',
                },
                {
                    name: '羊力大仙',
                    category: '妖怪',
                },
                {
                    name: '翠云山芭蕉洞',
                    category: '地点',
                },
                {
                    name: '腊梅精',
                    category: '妖怪',
                },
                {
                    name: '芭将军',
                    category: '妖怪',
                },
                {
                    name: '药叉将',
                    category: '神仙',
                },
                {
                    name: '灵台方寸山',
                    category: '地点',
                },
                {
                    name: '萧瑀',
                    category: '凡人',
                },
                {
                    name: '薛仁贵',
                    category: '凡人',
                },
                {
                    name: '虎先锋',
                    category: '妖怪',
                },
                {
                    name: '虎力大仙',
                    category: '妖怪',
                },
                {
                    name: '鹿力大仙',
                    category: '妖怪',
                },
                {
                    name: '虞世南',
                    category: '凡人',
                },
                {
                    name: '蜈蚣精',
                    category: '妖怪',
                },
                {
                    name: '黄花观',
                    category: '地点',
                },
                {
                    name: '蜘蛛精',
                    category: '妖怪',
                },
                {
                    name: '班',
                    category: '妖怪',
                },
                {
                    name: '蚂',
                    category: '妖怪',
                },
                {
                    name: '蜜',
                    category: '妖怪',
                },
                {
                    name: '蜡',
                    category: '妖怪',
                },
                {
                    name: '蜢',
                    category: '妖怪',
                },
                {
                    name: '蜻',
                    category: '妖怪',
                },
                {
                    name: '蠦',
                    category: '妖怪',
                },
                {
                    name: '蝎子精',
                    category: '妖怪',
                },
                {
                    name: '蟒蛇精',
                    category: '妖怪',
                },
                {
                    name: '袁天罡',
                    category: '凡人',
                },
                {
                    name: '袁守诚',
                    category: '凡人',
                },
                {
                    name: '许敬宗',
                    category: '凡人',
                },
                {
                    name: '赤脚大仙',
                    category: '神仙',
                },
                {
                    name: '赤身鬼',
                    category: '妖怪',
                },
                {
                    name: '车迟国国王',
                    category: '凡人',
                },
                {
                    name: '辟寒大王',
                    category: '妖怪',
                },
                {
                    name: '辟尘大王',
                    category: '妖怪',
                },
                {
                    name: '辟暑大王',
                    category: '妖怪',
                },
                {
                    name: '青龙山玄英洞',
                    category: '地点',
                },
                {
                    name: '迦叶',
                    category: '神仙',
                },
                {
                    name: '郭申',
                    category: '凡人',
                },
                {
                    name: '金池长老',
                    category: '凡人',
                },
                {
                    name: '观音禅院',
                    category: '地点',
                },
                {
                    name: '广智',
                    category: '凡人',
                },
                {
                    name: '广谋',
                    category: '凡人',
                },
                {
                    name: '狮驼岭',
                    category: '地点',
                },
                {
                    name: '金顶大仙',
                    category: '神仙',
                },
                {
                    name: '玉真观',
                    category: '地点',
                },
                {
                    name: '金鼻白毛老鼠精',
                    category: '妖怪',
                },
                {
                    name: '陷空山无底洞',
                    category: '地点',
                },
                {
                    name: '铁背苍狼',
                    category: '妖怪',
                },
                {
                    name: '万寿山五庄观',
                    category: '地点',
                },
                {
                    name: '阿难',
                    category: '神仙',
                },
                {
                    name: '陈关保',
                    category: '凡人',
                },
                {
                    name: '陈清',
                    category: '凡人',
                },
                {
                    name: '雷公',
                    category: '神仙',
                },
                {
                    name: '雾里云',
                    category: '妖怪',
                },
                {
                    name: '青脸儿',
                    category: '妖怪',
                },
                {
                    name: '顺风耳',
                    category: '神仙',
                },
                {
                    name: '风婆',
                    category: '神仙',
                },
                {
                    name: '马元帅',
                    category: '妖怪',
                },
                {
                    name: '高士廉',
                    category: '凡人',
                },
                {
                    name: '高太公',
                    category: '凡人',
                },
                {
                    name: '高玉兰',
                    category: '凡人',
                },
                {
                    name: '高香兰',
                    category: '凡人',
                },
                {
                    name: '高老庄',
                    category: '地点',
                },
                {
                    name: '鱼肚将',
                    category: '神仙',
                },
                {
                    name: '黄眉大王',
                    category: '妖怪',
                },
                {
                    name: '黄风岭黄风洞',
                    category: '地点',
                },
                {
                    name: '黑水河',
                    category: '地点',
                },
                {
                    name: '一秤金',
                    category: '凡人',
                },
                {
                    name: '车迟国',
                    category: '地点',
                },
                {
                    name: '陈澄',
                    category: '凡人',
                },
                {
                    name: '七仙女',
                    category: '神仙',
                },
                {
                    name: '王母娘娘',
                    category: '神仙',
                },
                {
                    name: '皂衣仙女',
                    category: '神仙',
                },
                {
                    name: '素衣仙女',
                    category: '神仙',
                },
                {
                    name: '紫衣仙女',
                    category: '神仙',
                },
                {
                    name: '红衣仙女',
                    category: '神仙',
                },
                {
                    name: '绿衣仙女',
                    category: '神仙',
                },
                {
                    name: '青衣仙女',
                    category: '神仙',
                },
                {
                    name: '黄衣仙女',
                    category: '神仙',
                },
                {
                    name: '七十二洞妖王',
                    category: '妖怪',
                },
                {
                    name: '孙悟空',
                    category: '取经团队',
                },
                {
                    name: '四大天王',
                    category: '神仙',
                },
                {
                    name: '七大圣',
                    category: 'NULL',
                },
                {
                    name: '大鹏魔王',
                    category: '妖怪',
                },
                {
                    name: '牛魔王',
                    category: '妖怪',
                },
                {
                    name: '狮驼王',
                    category: '妖怪',
                },
                {
                    name: '猕猴王',
                    category: '妖怪',
                },
                {
                    name: '禺狨王',
                    category: '妖怪',
                },
                {
                    name: '美猴王',
                    category: 'NULL',
                },
                {
                    name: '蛟魔王',
                    category: '妖怪',
                },
                {
                    name: '七绝山',
                    category: '地点',
                },
                {
                    name: '祭赛国',
                    category: '地点',
                },
                {
                    name: '万圣公主',
                    category: '妖怪',
                },
                {
                    name: '乱石山碧波潭',
                    category: '地点',
                },
                {
                    name: '猪八戒',
                    category: '取经团队',
                },
                {
                    name: '万圣龙婆',
                    category: '妖怪',
                },
                {
                    name: '万圣龙王',
                    category: '妖怪',
                },
                {
                    name: '九头虫',
                    category: '妖怪',
                },
                {
                    name: '万岁狐王',
                    category: '妖怪',
                },
                {
                    name: '玉面狐狸',
                    category: '妖怪',
                },
                {
                    name: '积雷山摩云洞',
                    category: '地点',
                },
                {
                    name: '三清',
                    category: '神仙',
                },
                {
                    name: '玉皇大帝',
                    category: '神仙',
                },
                {
                    name: '元始天尊',
                    category: '神仙',
                },
                {
                    name: '灵宝天尊',
                    category: '神仙',
                },
                {
                    name: '道德天尊',
                    category: '神仙',
                },
                {
                    name: '东方朔',
                    category: '神仙',
                },
                {
                    name: '东海龙王',
                    category: '神仙',
                },
                {
                    name: '北海龙王',
                    category: '神仙',
                },
                {
                    name: '南海龙王',
                    category: '神仙',
                },
                {
                    name: '西海龙王',
                    category: '神仙',
                },
                {
                    name: '龙王',
                    category: '神仙',
                },
                {
                    name: '丹桂精',
                    category: '妖怪',
                },
                {
                    name: '杏仙',
                    category: '妖怪',
                },
                {
                    name: '乌巢禅师',
                    category: 'NULL',
                },
                {
                    name: '乌斯藏国',
                    category: '地点',
                },
                {
                    name: '浮屠山',
                    category: '地点',
                },
                {
                    name: '乌鸡国国王',
                    category: '凡人',
                },
                {
                    name: '乌鸡国',
                    category: '地点',
                },
                {
                    name: '乌鸡国太子',
                    category: '凡人',
                },
                {
                    name: '九尾狐狸',
                    category: '妖怪',
                },
                {
                    name: '金角大王',
                    category: '妖怪',
                },
                {
                    name: '银角大王',
                    category: '妖怪',
                },
                {
                    name: '压龙洞',
                    category: '地点',
                },
                {
                    name: '九曜星官',
                    category: '神仙',
                },
                {
                    name: '土德星君',
                    category: '神仙',
                },
                {
                    name: '太阳星君',
                    category: '神仙',
                },
                {
                    name: '太阴星君',
                    category: '神仙',
                },
                {
                    name: '木德星君',
                    category: '神仙',
                },
                {
                    name: '水德星君',
                    category: '神仙',
                },
                {
                    name: '火德星君',
                    category: '神仙',
                },
                {
                    name: '罗猴星君',
                    category: '神仙',
                },
                {
                    name: '计都星君',
                    category: '神仙',
                },
                {
                    name: '金德星君',
                    category: '神仙',
                },
                {
                    name: '九灵元圣',
                    category: '妖怪',
                },
                {
                    name: '太乙救苦天尊',
                    category: '神仙',
                },
                {
                    name: '竹节山九曲盘桓洞',
                    category: '地点',
                },
                {
                    name: '伏狸精',
                    category: '妖怪',
                },
                {
                    name: '抟象精',
                    category: '妖怪',
                },
                {
                    name: '狻猊精',
                    category: '妖怪',
                },
                {
                    name: '猱狮精',
                    category: '妖怪',
                },
                {
                    name: '白泽精',
                    category: '妖怪',
                },
                {
                    name: '雪狮精',
                    category: '妖怪',
                },
                {
                    name: '黄狮精',
                    category: '妖怪',
                },
                {
                    name: '二十八宿',
                    category: '神仙',
                },
                {
                    name: '井木犴',
                    category: '神仙',
                },
                {
                    name: '亢金龙',
                    category: '神仙',
                },
                {
                    name: '危月燕',
                    category: '神仙',
                },
                {
                    name: '参水猿',
                    category: '神仙',
                },
                {
                    name: '壁水獝',
                    category: '神仙',
                },
                {
                    name: '奎木狼',
                    category: '神仙',
                },
                {
                    name: '女土蝠',
                    category: '神仙',
                },
                {
                    name: '娄金狗',
                    category: '神仙',
                },
                {
                    name: '室火猪',
                    category: '神仙',
                },
                {
                    name: '尾火虎',
                    category: '神仙',
                },
                {
                    name: '张月鹿',
                    category: '神仙',
                },
                {
                    name: '心月狐',
                    category: '神仙',
                },
                {
                    name: '房日兔',
                    category: '神仙',
                },
                {
                    name: '斗木獬',
                    category: '神仙',
                },
                {
                    name: '星日马',
                    category: '神仙',
                },
                {
                    name: '昴日鸡',
                    category: '神仙',
                },
                {
                    name: '柳土獐',
                    category: '神仙',
                },
                {
                    name: '毕月乌',
                    category: '神仙',
                },
                {
                    name: '氐土貉',
                    category: '神仙',
                },
                {
                    name: '牛金牛',
                    category: '神仙',
                },
                {
                    name: '箕水豹',
                    category: '神仙',
                },
                {
                    name: '翼火蛇',
                    category: '神仙',
                },
                {
                    name: '胃土彘',
                    category: '神仙',
                },
                {
                    name: '虚日鼠',
                    category: '神仙',
                },
                {
                    name: '角木蛟',
                    category: '神仙',
                },
                {
                    name: '觜火猴',
                    category: '神仙',
                },
                {
                    name: '轸水蚓',
                    category: '神仙',
                },
                {
                    name: '鬼金羊',
                    category: '神仙',
                },
                {
                    name: '二郎神',
                    category: '神仙',
                },
                {
                    name: '云里雾',
                    category: '妖怪',
                },
                {
                    name: '红孩儿',
                    category: '妖怪',
                },
                {
                    name: '五岳四渎',
                    category: '神仙',
                },
                {
                    name: '五斗星君',
                    category: '神仙',
                },
                {
                    name: '五方五老',
                    category: '神仙',
                },
                {
                    name: '东方崇恩圣帝',
                    category: '神仙',
                },
                {
                    name: '中央黄极黄角大仙',
                    category: '神仙',
                },
                {
                    name: '北方北极玄灵',
                    category: '神仙',
                },
                {
                    name: '十洲三岛仙翁',
                    category: '神仙',
                },
                {
                    name: '南方南极观音',
                    category: '神仙',
                },
                {
                    name: '五方揭谛',
                    category: '神仙',
                },
                {
                    name: '井龙王',
                    category: '神仙',
                },
                {
                    name: '天竺国',
                    category: '地点',
                },
                {
                    name: '伶俐虫',
                    category: '妖怪',
                },
                {
                    name: '精细鬼',
                    category: '妖怪',
                },
                {
                    name: '平顶山莲花洞',
                    category: '地点',
                },
                {
                    name: '倚海龙',
                    category: '妖怪',
                },
                {
                    name: '六丁六甲',
                    category: '神仙',
                },
                {
                    name: '六耳猕猴',
                    category: '妖怪',
                },
                {
                    name: '兴烘掀',
                    category: '妖怪',
                },
                {
                    name: '凌空子',
                    category: '妖怪',
                },
                {
                    name: '荆棘岭木仙庵',
                    category: '地点',
                },
                {
                    name: '刁钻古怪',
                    category: '妖怪',
                },
                {
                    name: '豹头山虎口洞',
                    category: '地点',
                },
                {
                    name: '古怪刁钻',
                    category: '妖怪',
                },
                {
                    name: '刘伯钦',
                    category: '凡人',
                },
                {
                    name: '双叉岭',
                    category: '地点',
                },
                {
                    name: '刘全',
                    category: '凡人',
                },
                {
                    name: '李翠莲',
                    category: '凡人',
                },
                {
                    name: '劲节十八公',
                    category: '妖怪',
                },
                {
                    name: '北斗七元',
                    category: '神仙',
                },
                {
                    name: '北极紫微大帝',
                    category: '神仙',
                },
                {
                    name: '十二元辰',
                    category: '神仙',
                },
                {
                    name: '十大阎王',
                    category: '神仙',
                },
                {
                    name: '地藏菩萨',
                    category: '神仙',
                },
                {
                    name: '仵官王',
                    category: '神仙',
                },
                {
                    name: '卞城王',
                    category: '神仙',
                },
                {
                    name: '宋帝王',
                    category: '神仙',
                },
                {
                    name: '平等王',
                    category: '神仙',
                },
                {
                    name: '楚江王',
                    category: '神仙',
                },
                {
                    name: '泰山王',
                    category: '神仙',
                },
                {
                    name: '秦广王',
                    category: '神仙',
                },
                {
                    name: '转轮王',
                    category: '神仙',
                },
                {
                    name: '都市王',
                    category: '神仙',
                },
                {
                    name: '阎罗王',
                    category: '神仙',
                },
                {
                    name: '千里眼',
                    category: '神仙',
                },
                {
                    name: '南山大王',
                    category: '妖怪',
                },
                {
                    name: '灭法国',
                    category: '地点',
                },
                {
                    name: '隐雾山折岳连环洞',
                    category: '地点',
                },
                {
                    name: '南斗六司',
                    category: '神仙',
                },
                {
                    name: '南极寿星',
                    category: '神仙',
                },
                {
                    name: '蓬莱仙岛',
                    category: '地点',
                },
                {
                    name: '卵二姐',
                    category: '妖怪',
                },
                {
                    name: '福陵山云栈洞',
                    category: '地点',
                },
                {
                    name: '大唐',
                    category: '地点',
                },
                {
                    name: '右弼',
                    category: '神仙',
                },
                {
                    name: '号山枯松涧火云洞',
                    category: '地点',
                },
                {
                    name: '哪吒',
                    category: '神仙',
                },
                {
                    name: '木吒',
                    category: '神仙',
                },
                {
                    name: '金吒',
                    category: '神仙',
                },
                {
                    name: '陈塘关',
                    category: '地点',
                },
                {
                    name: '太乙真人',
                    category: '神仙',
                },
                {
                    name: '如来佛祖',
                    category: '神仙',
                },
                {
                    name: '托塔天王',
                    category: '神仙',
                },
                {
                    name: '哮天犬',
                    category: '神仙',
                },
                {
                    name: '唐僧',
                    category: '取经团队',
                },
                {
                    name: '金蝉子',
                    category: 'NULL',
                },
                {
                    name: '小白龙',
                    category: '取经团队',
                },
                {
                    name: '沙悟净',
                    category: '取经团队',
                },
                {
                    name: '唐太宗',
                    category: '凡人',
                },
                {
                    name: '陈光蕊',
                    category: '凡人',
                },
                {
                    name: '李玉英',
                    category: '凡人',
                },
                {
                    name: '李渊',
                    category: '凡人',
                },
                {
                    name: '四值功曹',
                    category: '神仙',
                },
                {
                    name: '四圣真君',
                    category: '神仙',
                },
                {
                    name: '佑圣真君',
                    category: '神仙',
                },
                {
                    name: '天佑元帅',
                    category: '神仙',
                },
                {
                    name: '天蓬元帅',
                    category: '神仙',
                },
                {
                    name: '翊圣真君',
                    category: '神仙',
                },
                {
                    name: '四大天师',
                    category: '神仙',
                },
                {
                    name: '丘弘济',
                    category: '神仙',
                },
                {
                    name: '张道陵',
                    category: '神仙',
                },
                {
                    name: '葛仙翁',
                    category: '神仙',
                },
                {
                    name: '许旌阳',
                    category: '神仙',
                },
                {
                    name: '增长天王',
                    category: '神仙',
                },
                {
                    name: '多闻天王',
                    category: '神仙',
                },
                {
                    name: '广目天王',
                    category: '神仙',
                },
                {
                    name: '持国天王',
                    category: '神仙',
                },
                {
                    name: '四大菩萨',
                    category: '神仙',
                },
                {
                    name: '文殊菩萨',
                    category: '神仙',
                },
                {
                    name: '普贤菩萨',
                    category: '神仙',
                },
                {
                    name: '观音菩萨',
                    category: '神仙',
                },
                {
                    name: '四部神祇',
                    category: '神仙',
                },
                {
                    name: '云童',
                    category: '神仙',
                },
                {
                    name: '雷将',
                    category: '神仙',
                },
                {
                    name: '风伯',
                    category: '神仙',
                },
                {
                    name: '夜游神',
                    category: '神仙',
                },
                {
                    name: '大力金刚',
                    category: '神仙',
                },
                {
                    name: '大圣国师王菩萨',
                    category: '神仙',
                },
                {
                    name: '盱眙山',
                    category: '地点',
                },
                {
                    name: '小张太子',
                    category: 'NULL',
                },
                {
                    name: '四大神将',
                    category: 'NULL',
                },
                {
                    name: '天竺国公主',
                    category: '凡人',
                },
                {
                    name: '素娥仙子',
                    category: '神仙',
                },
                {
                    name: '太上老君',
                    category: '神仙',
                },
                {
                    name: '太白金星',
                    category: '神仙',
                },
                {
                    name: '奔波儿灞',
                    category: '妖怪',
                },
                {
                    name: '如意真仙',
                    category: '妖怪',
                },
                {
                    name: '西梁女国',
                    category: '地点',
                },
                {
                    name: '解阳山聚仙庵破儿洞',
                    category: '地点',
                },
                {
                    name: '大雷音寺',
                    category: '地点',
                },
                {
                    name: '孔雀大明王菩萨',
                    category: '神仙',
                },
                {
                    name: '姚太尉',
                    category: '凡人',
                },
                {
                    name: '嫦娥仙子',
                    category: '神仙',
                },
                {
                    name: '镇元子',
                    category: '神仙',
                },
                {
                    name: '弼马温',
                    category: '神仙',
                },
                {
                    name: '水帘洞',
                    category: '地点',
                },
                {
                    name: '菩提祖师',
                    category: '神仙',
                },
                {
                    name: '玉华城大王子',
                    category: '凡人',
                },
                {
                    name: '孤直公',
                    category: '妖怪',
                },
                {
                    name: '寅将军',
                    category: '妖怪',
                },
                {
                    name: '寇洪',
                    category: '凡人',
                },
                {
                    name: '尉迟公',
                    category: '凡人',
                },
                {
                    name: '南赡部洲',
                    category: 'NULL',
                },
                {
                    name: '弥勒佛',
                    category: '神仙',
                },
                {
                    name: '摩昂太子',
                    category: 'NULL',
                },
                {
                    name: '小钻风',
                    category: '妖怪',
                },
                {
                    name: '金翅大鹏雕',
                    category: '妖怪',
                },
                {
                    name: '青毛狮子怪',
                    category: '妖怪',
                },
                {
                    name: '黄牙老象',
                    category: '妖怪',
                },
                {
                    name: '狮驼国',
                    category: '地点',
                },
                {
                    name: '狮驼岭狮驼洞',
                    category: '地点',
                },
                {
                    name: '小雷音寺',
                    category: '地点',
                },
                {
                    name: '崩将军',
                    category: '妖怪',
                },
                {
                    name: '左辅',
                    category: '神仙',
                },
                {
                    name: '巨灵神',
                    category: '神仙',
                },
                {
                    name: '巴山虎',
                    category: '妖怪',
                },
                {
                    name: '布雾郎君',
                    category: '神仙',
                },
                {
                    name: '宝象国',
                    category: '地点',
                },
                {
                    name: '康太尉',
                    category: '凡人',
                },
                {
                    name: '张士衡',
                    category: '凡人',
                },
                {
                    name: '张太尉',
                    category: '凡人',
                },
                {
                    name: '徐世勣',
                    category: '凡人',
                },
                {
                    name: '快如风',
                    category: '妖怪',
                },
                {
                    name: '急如火',
                    category: '妖怪',
                },
                {
                    name: '房玄龄',
                    category: '凡人',
                },
                {
                    name: '护国公',
                    category: '凡人',
                },
                {
                    name: '拂云叟',
                    category: '妖怪',
                },
                {
                    name: '掀烘兴',
                    category: '妖怪',
                },
                {
                    name: '文曲星官',
                    category: '神仙',
                },
                {
                    name: '斑衣鳜婆',
                    category: '妖怪',
                },
                {
                    name: '灵感大王',
                    category: '妖怪',
                },
                {
                    name: '通天河',
                    category: '地点',
                },
                {
                    name: '日游神',
                    category: '神仙',
                },
                {
                    name: '昴日星官',
                    category: '神仙',
                },
                {
                    name: '光明宫',
                    category: '地点',
                },
                {
                    name: '毗蓝婆菩萨',
                    category: '神仙',
                },
                {
                    name: '六牙白象',
                    category: 'NULL',
                },
                {
                    name: '有来有去',
                    category: '妖怪',
                },
                {
                    name: '赛太岁',
                    category: '妖怪',
                },
                {
                    name: '朱紫国',
                    category: '地点',
                },
                {
                    name: '麒麟山獬豸洞',
                    category: '地点',
                },
                {
                    name: '朱紫国国王',
                    category: '凡人',
                },
                {
                    name: '朱紫国王后',
                    category: '凡人',
                },
                {
                    name: '李太尉',
                    category: '凡人',
                },
                {
                    name: '李淳风',
                    category: '凡人',
                },
                {
                    name: '杜如晦',
                    category: '凡人',
                },
                {
                    name: '柳林坡清华洞',
                    category: '地点',
                },
                {
                    name: '比丘国',
                    category: '地点',
                },
                {
                    name: '武曲星君',
                    category: '神仙',
                },
                {
                    name: '段志贤',
                    category: '凡人',
                },
                {
                    name: '殷开山',
                    category: '凡人',
                },
                {
                    name: '殷温娇',
                    category: '凡人',
                },
                {
                    name: '毒敌山琵琶洞',
                    category: '地点',
                },
                {
                    name: '女儿国',
                    category: '地点',
                },
                {
                    name: '比丘国国王',
                    category: '凡人',
                },
                {
                    name: '紫云山千花洞',
                    category: '地点',
                },
                {
                    name: '水猿大圣',
                    category: '妖怪',
                },
                {
                    name: '淮河',
                    category: '地点',
                },
                {
                    name: '卷帘大将',
                    category: '神仙',
                },
                {
                    name: '流沙河',
                    category: '地点',
                },
                {
                    name: '泾河龙王',
                    category: '神仙',
                },
                {
                    name: '鼍龙怪',
                    category: '妖怪',
                },
                {
                    name: '西海龙王之妹',
                    category: 'NULL',
                },
                {
                    name: '死亡',
                    category: 'NULL',
                },
                {
                    name: '流元帅',
                    category: '妖怪',
                },
                {
                    name: '混世魔王',
                    category: '妖怪',
                },
                {
                    name: '傲来国',
                    category: '地点',
                },
                {
                    name: '坎源山水脏洞',
                    category: '地点',
                },
                {
                    name: '游奕灵官',
                    category: '神仙',
                },
                {
                    name: '灞波儿奔',
                    category: '妖怪',
                },
                {
                    name: '灭法国国王',
                    category: '凡人',
                },
                {
                    name: '灵吉菩萨',
                    category: '神仙',
                },
                {
                    name: '小须弥山',
                    category: '地点',
                },
                {
                    name: '黄风怪',
                    category: '妖怪',
                },
                {
                    name: '熊山君',
                    category: '妖怪',
                },
                {
                    name: '特处士',
                    category: '妖怪',
                },
                {
                    name: '避水金晶兽',
                    category: 'NULL',
                },
                {
                    name: '积雷山',
                    category: '地点',
                },
                {
                    name: '狐阿七',
                    category: '妖怪',
                },
                {
                    name: '独角兕大王',
                    category: '妖怪',
                },
                {
                    name: '金兜山金兜洞',
                    category: '地点',
                },
                {
                    name: '独角鬼王',
                    category: '妖怪',
                },
                {
                    name: '花果山',
                    category: '地点',
                },
                {
                    name: '狮猁怪',
                    category: '妖怪',
                },
                {
                    name: '高翠兰',
                    category: '凡人',
                },
                {
                    name: '獬豸洞',
                    category: '地点',
                },
                {
                    name: '獬豸洞先锋',
                    category: '妖怪',
                },
                {
                    name: '玉兔精',
                    category: '妖怪',
                },
                {
                    name: '玉华王',
                    category: '凡人',
                },
                {
                    name: '玉华州',
                    category: 'NULL',
                },
                {
                    name: '王圭',
                    category: '凡人',
                },
                {
                    name: '王灵官',
                    category: '神仙',
                },
                {
                    name: '白花蛇精',
                    category: '妖怪',
                },
                {
                    name: '苍狼精',
                    category: '妖怪',
                },
                {
                    name: '黑熊精',
                    category: '妖怪',
                },
                {
                    name: '白雄尊者',
                    category: '神仙',
                },
                {
                    name: '燃灯古佛',
                    category: '神仙',
                },
                {
                    name: '白面狐狸',
                    category: '妖怪',
                },
                {
                    name: '白骨精',
                    category: '妖怪',
                },
                {
                    name: '白虎岭白骨洞',
                    category: '地点',
                },
                {
                    name: '白鹿精',
                    category: '妖怪',
                },
                {
                    name: '白鼋',
                    category: 'NULL',
                },
                {
                    name: '百花羞',
                    category: '妖怪',
                },
            ],
            links: [
                {
                    source: '百花羞',
                    target: '黄袍怪',
                    name: '丈夫',
                },
                {
                    source: '蜘蛛精',
                    target: '盘丝岭盘丝洞',
                    name: '居住地',
                },
                {
                    source: '黄袍怪',
                    target: '碗子山波月洞',
                    name: '居住地',
                },
                {
                    source: '祭赛国',
                    target: '祭赛国国王',
                    name: '主人',
                },
                {
                    source: '翠云山芭蕉洞',
                    target: '火焰山',
                    name: '位于',
                },
                {
                    source: '积雷山摩云洞',
                    target: '火焰山',
                    name: '位于',
                },
                {
                    source: '红孩儿',
                    target: '铁扇公主',
                    name: '母亲',
                },
                {
                    source: '虎力大仙',
                    target: '羊力大仙',
                    name: '师弟',
                },
                {
                    source: '铁扇公主',
                    target: '翠云山芭蕉洞',
                    name: '居住地',
                },
                {
                    source: '菩提祖师',
                    target: '灵台方寸山',
                    name: '居住地',
                },
                {
                    source: '虎力大仙',
                    target: '鹿力大仙',
                    name: '师弟',
                },
                {
                    source: '蜘蛛精',
                    target: '蜈蚣精',
                    name: '师兄',
                },
                {
                    source: '蜈蚣精',
                    target: '黄花观',
                    name: '居住地',
                },
                {
                    source: '蜈蚣精',
                    target: '蜘蛛精',
                    name: '师妹',
                },
                {
                    source: '蜘蛛精',
                    target: '班',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蚂',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蜜',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蜡',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蜢',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蜻',
                    name: '义子',
                },
                {
                    source: '蜘蛛精',
                    target: '蠦',
                    name: '义子',
                },
                {
                    source: '袁天罡',
                    target: '袁守诚',
                    name: '叔父',
                },
                {
                    source: '辟暑大王',
                    target: '辟寒大王',
                    name: '兄弟',
                },
                {
                    source: '辟暑大王',
                    target: '辟尘大王',
                    name: '兄弟',
                },
                {
                    source: '辟寒大王',
                    target: '辟尘大王',
                    name: '兄弟',
                },
                {
                    source: '辟寒大王',
                    target: '辟暑大王',
                    name: '兄弟',
                },
                {
                    source: '辟暑大王',
                    target: '青龙山玄英洞',
                    name: '居住地',
                },
                {
                    source: '辟尘大王',
                    target: '青龙山玄英洞',
                    name: '居住地',
                },
                {
                    source: '辟寒大王',
                    target: '青龙山玄英洞',
                    name: '居住地',
                },
                {
                    source: '黑熊精',
                    target: '金池长老',
                    name: '朋友',
                },
                {
                    source: '金池长老',
                    target: '观音禅院',
                    name: '居住地',
                },
                {
                    source: '金池长老',
                    target: '广智',
                    name: '徒孙',
                },
                {
                    source: '金池长老',
                    target: '广谋',
                    name: '徒孙',
                },
                {
                    source: '金翅大鹏雕',
                    target: '狮驼岭',
                    name: '居住地',
                },
                {
                    source: '金顶大仙',
                    target: '玉真观',
                    name: '居住地',
                },
                {
                    source: '金鼻白毛老鼠精',
                    target: '陷空山无底洞',
                    name: '居住地',
                },
                {
                    source: '镇元子',
                    target: '万寿山五庄观',
                    name: '居住地',
                },
                {
                    source: '陈清',
                    target: '陈关保',
                    name: '儿子',
                },
                {
                    source: '陈关保',
                    target: '陈清',
                    name: '父亲',
                },
                {
                    source: '高翠兰',
                    target: '高太公',
                    name: '父亲',
                },
                {
                    source: '高太公',
                    target: '高玉兰',
                    name: '女儿',
                },
                {
                    source: '高太公',
                    target: '高香兰',
                    name: '女儿',
                },
                {
                    source: '高太公',
                    target: '高老庄',
                    name: '居住地',
                },
                {
                    source: '黄风怪',
                    target: '黄风岭黄风洞',
                    name: '居住地',
                },
                {
                    source: '鼍龙怪',
                    target: '黑水河',
                    name: '居住地',
                },
                {
                    source: '陈澄',
                    target: '一秤金',
                    name: '女儿',
                },
                {
                    source: '鹿力大仙',
                    target: '车迟国',
                    name: '国籍',
                },
                {
                    source: '陈关保',
                    target: '车迟国',
                    name: '国籍',
                },
                {
                    source: '金兜山金兜洞',
                    target: '车迟国',
                    name: '位于',
                },
                {
                    source: '通天河',
                    target: '车迟国',
                    name: '位于',
                },
                {
                    source: '车迟国国王',
                    target: '车迟国',
                    name: '居住地',
                },
                {
                    source: '虎力大仙',
                    target: '车迟国',
                    name: '国籍',
                },
                {
                    source: '羊力大仙',
                    target: '车迟国',
                    name: '国籍',
                },
                {
                    source: '一秤金',
                    target: '车迟国',
                    name: '国籍',
                },
                {
                    source: '陈清',
                    target: '陈澄',
                    name: '哥哥',
                },
                {
                    source: '一秤金',
                    target: '陈澄',
                    name: '父亲',
                },
                {
                    source: '玉皇大帝',
                    target: '王母娘娘',
                    name: '同事',
                },
                {
                    source: '东方朔',
                    target: '王母娘娘',
                    name: '上司',
                },
                {
                    source: '七仙女',
                    target: '王母娘娘',
                    name: '上司',
                },
                {
                    source: '七仙女',
                    target: '皂衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '素衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '紫衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '红衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '绿衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '青衣仙女',
                    name: '组成',
                },
                {
                    source: '七仙女',
                    target: '黄衣仙女',
                    name: '组成',
                },
                {
                    source: '黄狮精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '鹿力大仙',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '马元帅',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '青脸儿',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '镇元子',
                    target: '孙悟空',
                    name: '义兄弟',
                },
                {
                    source: '铁背苍狼',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '蟒蛇精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '蜘蛛精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '虎力大仙',
                    target: '孙悟空',
                    name: '国籍',
                },
                {
                    source: '苍狼精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '芭将军',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '羊力大仙',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '红孩儿',
                    target: '孙悟空',
                    name: '义叔叔',
                },
                {
                    source: '白骨精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '白面狐狸',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '白花蛇精',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '猪八戒',
                    target: '孙悟空',
                    name: '师兄',
                },
                {
                    source: '独角鬼王',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '牛魔王',
                    target: '孙悟空',
                    name: '弟弟',
                },
                {
                    source: '混世魔王',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '流元帅',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '沙悟净',
                    target: '孙悟空',
                    name: '师兄',
                },
                {
                    source: '有来有去',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '崩将军',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '小钻风',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '小白龙',
                    target: '孙悟空',
                    name: '师兄',
                },
                {
                    source: '唐僧',
                    target: '孙悟空',
                    name: '徒弟',
                },
                {
                    source: '古怪刁钻',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '刁钻古怪',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '六耳猕猴',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '九尾狐狸',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '万圣龙王',
                    target: '孙悟空',
                    name: '终结者',
                },
                {
                    source: '七十二洞妖王',
                    target: '孙悟空',
                    name: '上司',
                },
                {
                    source: '独角鬼王',
                    target: '四大天王',
                    name: '终结者',
                },
                {
                    source: '七十二洞妖王',
                    target: '四大天王',
                    name: '终结者',
                },
                {
                    source: '孙悟空',
                    target: '七大圣',
                    name: '义兄弟',
                },
                {
                    source: '七大圣',
                    target: '大鹏魔王',
                    name: '组成',
                },
                {
                    source: '铁扇公主',
                    target: '牛魔王',
                    name: '丈夫',
                },
                {
                    source: '避水金晶兽',
                    target: '牛魔王',
                    name: '主人',
                },
                {
                    source: '红孩儿',
                    target: '牛魔王',
                    name: '父亲',
                },
                {
                    source: '玉面狐狸',
                    target: '牛魔王',
                    name: '丈夫',
                },
                {
                    source: '如意真仙',
                    target: '牛魔王',
                    name: '兄长',
                },
                {
                    source: '九头虫',
                    target: '牛魔王',
                    name: '好友',
                },
                {
                    source: '万岁狐王',
                    target: '牛魔王',
                    name: '女婿',
                },
                {
                    source: '万圣龙王',
                    target: '牛魔王',
                    name: '好友',
                },
                {
                    source: '七大圣',
                    target: '牛魔王',
                    name: '组成',
                },
                {
                    source: '七大圣',
                    target: '狮驼王',
                    name: '组成',
                },
                {
                    source: '七大圣',
                    target: '猕猴王',
                    name: '组成',
                },
                {
                    source: '七大圣',
                    target: '禺狨王',
                    name: '组成',
                },
                {
                    source: '孙悟空',
                    target: '美猴王',
                    name: '别名',
                },
                {
                    source: '七大圣',
                    target: '美猴王',
                    name: '组成',
                },
                {
                    source: '七大圣',
                    target: '蛟魔王',
                    name: '组成',
                },
                {
                    source: '蟒蛇精',
                    target: '七绝山',
                    name: '居住地',
                },
                {
                    source: '荆棘岭木仙庵',
                    target: '祭赛国',
                    name: '位于',
                },
                {
                    source: '小雷音寺',
                    target: '祭赛国',
                    name: '位于',
                },
                {
                    source: '奔波儿灞',
                    target: '祭赛国',
                    name: '国籍',
                },
                {
                    source: '九头虫',
                    target: '祭赛国',
                    name: '国籍',
                },
                {
                    source: '万圣龙王',
                    target: '祭赛国',
                    name: '国籍',
                },
                {
                    source: '万圣公主',
                    target: '祭赛国',
                    name: '国籍',
                },
                {
                    source: '七绝山',
                    target: '祭赛国',
                    name: '位于',
                },
                {
                    source: '九头虫',
                    target: '万圣公主',
                    name: '妻子',
                },
                {
                    source: '万圣龙王',
                    target: '万圣公主',
                    name: '女儿',
                },
                {
                    source: '万圣龙婆',
                    target: '万圣公主',
                    name: '女儿',
                },
                {
                    source: '九头虫',
                    target: '乱石山碧波潭',
                    name: '居住地',
                },
                {
                    source: '万圣龙王',
                    target: '乱石山碧波潭',
                    name: '居住地',
                },
                {
                    source: '万圣公主',
                    target: '乱石山碧波潭',
                    name: '居住地',
                },
                {
                    source: '辟暑大王',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '辟尘大王',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '赤身鬼',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '虎先锋',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '腊梅精',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '玉面狐狸',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '狐阿七',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '沙悟净',
                    target: '猪八戒',
                    name: '师兄',
                },
                {
                    source: '杏仙',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '小白龙',
                    target: '猪八戒',
                    name: '师兄',
                },
                {
                    source: '孤直公',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '孙悟空',
                    target: '猪八戒',
                    name: '师弟',
                },
                {
                    source: '唐僧',
                    target: '猪八戒',
                    name: '徒弟',
                },
                {
                    source: '南山大王',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '劲节十八公',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '凌空子',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '丹桂精',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '万圣公主',
                    target: '猪八戒',
                    name: '终结者',
                },
                {
                    source: '灞波儿奔',
                    target: '万圣龙王',
                    name: '上司',
                },
                {
                    source: '奔波儿灞',
                    target: '万圣龙王',
                    name: '上司',
                },
                {
                    source: '九头虫',
                    target: '万圣龙王',
                    name: '岳父',
                },
                {
                    source: '万圣龙婆',
                    target: '万圣龙王',
                    name: '丈夫',
                },
                {
                    source: '万圣龙王',
                    target: '九头虫',
                    name: '女婿',
                },
                {
                    source: '万圣龙婆',
                    target: '九头虫',
                    name: '女婿',
                },
                {
                    source: '玉面狐狸',
                    target: '万岁狐王',
                    name: '父亲',
                },
                {
                    source: '铁扇公主',
                    target: '玉面狐狸',
                    name: '情敌',
                },
                {
                    source: '牛魔王',
                    target: '玉面狐狸',
                    name: '妾',
                },
                {
                    source: '万岁狐王',
                    target: '玉面狐狸',
                    name: '女儿',
                },
                {
                    source: '玉面狐狸',
                    target: '积雷山摩云洞',
                    name: '居住地',
                },
                {
                    source: '万岁狐王',
                    target: '积雷山摩云洞',
                    name: '居住地',
                },
                {
                    source: '镇元子',
                    target: '三清',
                    name: '朋友',
                },
                {
                    source: '风婆',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '顺风耳',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '雷公',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '金顶大仙',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '赤脚大仙',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '纠察灵官',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '王灵官',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '游奕灵官',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '武曲星君',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '日游神',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '文曲星官',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '托塔天王',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '弼马温',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '布雾郎君',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '左辅',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '太白金星',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '太上老君',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '夜游神',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '四部神祇',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '四大天王',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '四大天师',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '四值功曹',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '哪吒',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '右弼',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '南极寿星',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '南斗六司',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '千里眼',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '十二元辰',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '北极紫微大帝',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '北斗七元',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '六丁六甲',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '五方揭谛',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '五方五老',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '五斗星君',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '五岳四渎',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '二郎神',
                    target: '玉皇大帝',
                    name: '舅舅',
                },
                {
                    source: '二十八宿',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '九曜星官',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '三清',
                    target: '玉皇大帝',
                    name: '上司',
                },
                {
                    source: '三清',
                    target: '元始天尊',
                    name: '组成',
                },
                {
                    source: '三清',
                    target: '灵宝天尊',
                    name: '组成',
                },
                {
                    source: '三清',
                    target: '道德天尊',
                    name: '组成',
                },
                {
                    source: '东海龙王',
                    target: '北海龙王',
                    name: '兄弟姐妹',
                },
                {
                    source: '东海龙王',
                    target: '南海龙王',
                    name: '兄弟姐妹',
                },
                {
                    source: '鼍龙怪',
                    target: '西海龙王',
                    name: '舅舅',
                },
                {
                    source: '小白龙',
                    target: '西海龙王',
                    name: '父亲',
                },
                {
                    source: '东海龙王',
                    target: '西海龙王',
                    name: '兄弟姐妹',
                },
                {
                    source: '西海龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '泾河龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '四部神祇',
                    target: '龙王',
                    name: '组成',
                },
                {
                    source: '南海龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '北海龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '井龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '东海龙王',
                    target: '龙王',
                    name: '所属',
                },
                {
                    source: '腊梅精',
                    target: '杏仙',
                    name: '主人',
                },
                {
                    source: '丹桂精',
                    target: '杏仙',
                    name: '主人',
                },
                {
                    source: '高太公',
                    target: '乌斯藏国',
                    name: '国籍',
                },
                {
                    source: '乌巢禅师',
                    target: '乌斯藏国',
                    name: '国籍',
                },
                {
                    source: '乌巢禅师',
                    target: '浮屠山',
                    name: '居住地',
                },
                {
                    source: '黑水河',
                    target: '乌鸡国',
                    name: '位于',
                },
                {
                    source: '狮猁怪',
                    target: '乌鸡国',
                    name: '国籍',
                },
                {
                    source: '号山枯松涧火云洞',
                    target: '乌鸡国',
                    name: '位于',
                },
                {
                    source: '乌鸡国太子',
                    target: '乌鸡国',
                    name: '国籍',
                },
                {
                    source: '乌鸡国国王',
                    target: '乌鸡国',
                    name: '国籍',
                },
                {
                    source: '金角大王',
                    target: '九尾狐狸',
                    name: '干娘',
                },
                {
                    source: '狐阿七',
                    target: '九尾狐狸',
                    name: '姐姐',
                },
                {
                    source: '精细鬼',
                    target: '金角大王',
                    name: '上司',
                },
                {
                    source: '狐阿七',
                    target: '金角大王',
                    name: '外甥',
                },
                {
                    source: '巴山虎',
                    target: '金角大王',
                    name: '上司',
                },
                {
                    source: '倚海龙',
                    target: '金角大王',
                    name: '上司',
                },
                {
                    source: '伶俐虫',
                    target: '金角大王',
                    name: '上司',
                },
                {
                    source: '九尾狐狸',
                    target: '金角大王',
                    name: '义子',
                },
                {
                    source: '金角大王',
                    target: '银角大王',
                    name: '兄弟',
                },
                {
                    source: '精细鬼',
                    target: '银角大王',
                    name: '上司',
                },
                {
                    source: '狐阿七',
                    target: '银角大王',
                    name: '外甥',
                },
                {
                    source: '巴山虎',
                    target: '银角大王',
                    name: '上司',
                },
                {
                    source: '倚海龙',
                    target: '银角大王',
                    name: '上司',
                },
                {
                    source: '伶俐虫',
                    target: '银角大王',
                    name: '上司',
                },
                {
                    source: '九尾狐狸',
                    target: '银角大王',
                    name: '义子',
                },
                {
                    source: '九尾狐狸',
                    target: '压龙洞',
                    name: '居住地',
                },
                {
                    source: '九曜星官',
                    target: '土德星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '太阳星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '太阴星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '木德星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '水德星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '火德星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '罗猴星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '计都星君',
                    name: '组成',
                },
                {
                    source: '九曜星官',
                    target: '金德星君',
                    name: '组成',
                },
                {
                    source: '黄狮精',
                    target: '九灵元圣',
                    name: '祖翁',
                },
                {
                    source: '青脸儿',
                    target: '九灵元圣',
                    name: '上司',
                },
                {
                    source: '九灵元圣',
                    target: '太乙救苦天尊',
                    name: '主人',
                },
                {
                    source: '青脸儿',
                    target: '竹节山九曲盘桓洞',
                    name: '居住地',
                },
                {
                    source: '九灵元圣',
                    target: '竹节山九曲盘桓洞',
                    name: '居住地',
                },
                {
                    source: '九灵元圣',
                    target: '伏狸精',
                    name: '干孙子',
                },
                {
                    source: '九灵元圣',
                    target: '抟象精',
                    name: '干孙子',
                },
                {
                    source: '九灵元圣',
                    target: '狻猊精',
                    name: '干孙子',
                },
                {
                    source: '九灵元圣',
                    target: '猱狮精',
                    name: '干孙子',
                },
                {
                    source: '九灵元圣',
                    target: '白泽精',
                    name: '干孙子',
                },
                {
                    source: '九灵元圣',
                    target: '雪狮精',
                    name: '干孙子',
                },
                {
                    source: '青脸儿',
                    target: '黄狮精',
                    name: '上司',
                },
                {
                    source: '古怪刁钻',
                    target: '黄狮精',
                    name: '主人',
                },
                {
                    source: '刁钻古怪',
                    target: '黄狮精',
                    name: '主人',
                },
                {
                    source: '九灵元圣',
                    target: '黄狮精',
                    name: '干孙子',
                },
                {
                    source: '辟寒大王',
                    target: '井木犴',
                    name: '终结者',
                },
                {
                    source: '二十八宿',
                    target: '井木犴',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '亢金龙',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '危月燕',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '参水猿',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '壁水獝',
                    name: '组成',
                },
                {
                    source: '黄袍怪',
                    target: '奎木狼',
                    name: '别名',
                },
                {
                    source: '二十八宿',
                    target: '奎木狼',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '女土蝠',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '娄金狗',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '室火猪',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '尾火虎',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '张月鹿',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '心月狐',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '房日兔',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '斗木獬',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '星日马',
                    name: '组成',
                },
                {
                    source: '昴日星官',
                    target: '昴日鸡',
                    name: '别名',
                },
                {
                    source: '二十八宿',
                    target: '昴日鸡',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '柳土獐',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '毕月乌',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '氐土貉',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '牛金牛',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '箕水豹',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '翼火蛇',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '胃土彘',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '虚日鼠',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '角木蛟',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '觜火猴',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '轸水蚓',
                    name: '组成',
                },
                {
                    source: '二十八宿',
                    target: '鬼金羊',
                    name: '组成',
                },
                {
                    source: '郭申',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '直健',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '李太尉',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '张太尉',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '康太尉',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '孙悟空',
                    target: '二郎神',
                    name: '义兄弟',
                },
                {
                    source: '嫦娥仙子',
                    target: '二郎神',
                    name: '朋友',
                },
                {
                    source: '姚太尉',
                    target: '二郎神',
                    name: '上司',
                },
                {
                    source: '哮天犬',
                    target: '二郎神',
                    name: '主人',
                },
                {
                    source: '雾里云',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '铁扇公主',
                    target: '红孩儿',
                    name: '儿子',
                },
                {
                    source: '掀烘兴',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '急如火',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '快如风',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '兴烘掀',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '云里雾',
                    target: '红孩儿',
                    name: '上司',
                },
                {
                    source: '五方五老',
                    target: '东方崇恩圣帝',
                    name: '组成',
                },
                {
                    source: '五方五老',
                    target: '中央黄极黄角大仙',
                    name: '组成',
                },
                {
                    source: '五方五老',
                    target: '北方北极玄灵',
                    name: '组成',
                },
                {
                    source: '五方五老',
                    target: '十洲三岛仙翁',
                    name: '组成',
                },
                {
                    source: '五方五老',
                    target: '南方南极观音',
                    name: '组成',
                },
                {
                    source: '黄风怪',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '青龙山玄英洞',
                    target: '天竺国',
                    name: '位于',
                },
                {
                    source: '辟暑大王',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '辟尘大王',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '豹头山虎口洞',
                    target: '天竺国',
                    name: '位于',
                },
                {
                    source: '竹节山九曲盘桓洞',
                    target: '天竺国',
                    name: '位于',
                },
                {
                    source: '白雄尊者',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '玉华王',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '玉兔精',
                    target: '天竺国',
                    name: '居住地',
                },
                {
                    source: '寇洪',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '天竺国公主',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '伏狸精',
                    target: '天竺国',
                    name: '国籍',
                },
                {
                    source: '伶俐虫',
                    target: '精细鬼',
                    name: '同僚',
                },
                {
                    source: '银角大王',
                    target: '平顶山莲花洞',
                    name: '居住地',
                },
                {
                    source: '金角大王',
                    target: '平顶山莲花洞',
                    name: '居住地',
                },
                {
                    source: '精细鬼',
                    target: '平顶山莲花洞',
                    name: '居住地',
                },
                {
                    source: '巴山虎',
                    target: '平顶山莲花洞',
                    name: '居住地',
                },
                {
                    source: '伶俐虫',
                    target: '平顶山莲花洞',
                    name: '居住地',
                },
                {
                    source: '拂云叟',
                    target: '凌空子',
                    name: '同僚',
                },
                {
                    source: '赤身鬼',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '杏仙',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '拂云叟',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '孤直公',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '劲节十八公',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '凌空子',
                    target: '荆棘岭木仙庵',
                    name: '居住地',
                },
                {
                    source: '黄狮精',
                    target: '豹头山虎口洞',
                    name: '居住地',
                },
                {
                    source: '古怪刁钻',
                    target: '豹头山虎口洞',
                    name: '居住地',
                },
                {
                    source: '刁钻古怪',
                    target: '豹头山虎口洞',
                    name: '居住地',
                },
                {
                    source: '刁钻古怪',
                    target: '古怪刁钻',
                    name: '搭档',
                },
                {
                    source: '特处士',
                    target: '双叉岭',
                    name: '居住地',
                },
                {
                    source: '熊山君',
                    target: '双叉岭',
                    name: '居住地',
                },
                {
                    source: '寅将军',
                    target: '双叉岭',
                    name: '居住地',
                },
                {
                    source: '刘伯钦',
                    target: '双叉岭',
                    name: '居住地',
                },
                {
                    source: '刘全',
                    target: '李翠莲',
                    name: '妻子',
                },
                {
                    source: '拂云叟',
                    target: '劲节十八公',
                    name: '同僚',
                },
                {
                    source: '四圣真君',
                    target: '北极紫微大帝',
                    name: '上司',
                },
                {
                    source: '四大菩萨',
                    target: '地藏菩萨',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '地藏菩萨',
                    name: '上司',
                },
                {
                    source: '十大阎王',
                    target: '仵官王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '卞城王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '宋帝王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '平等王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '楚江王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '泰山王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '秦广王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '转轮王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '都市王',
                    name: '组成',
                },
                {
                    source: '十大阎王',
                    target: '阎罗王',
                    name: '组成',
                },
                {
                    source: '铁背苍狼',
                    target: '南山大王',
                    name: '上司',
                },
                {
                    source: '隐雾山折岳连环洞',
                    target: '灭法国',
                    name: '位于',
                },
                {
                    source: '南山大王',
                    target: '灭法国',
                    name: '国籍',
                },
                {
                    source: '铁背苍狼',
                    target: '隐雾山折岳连环洞',
                    name: '居住地',
                },
                {
                    source: '南山大王',
                    target: '隐雾山折岳连环洞',
                    name: '居住地',
                },
                {
                    source: '白鹿精',
                    target: '南极寿星',
                    name: '主人',
                },
                {
                    source: '福星',
                    target: '蓬莱仙岛',
                    name: '居住地',
                },
                {
                    source: '禄星',
                    target: '蓬莱仙岛',
                    name: '居住地',
                },
                {
                    source: '南极寿星',
                    target: '蓬莱仙岛',
                    name: '居住地',
                },
                {
                    source: '猪八戒',
                    target: '卵二姐',
                    name: '前妻',
                },
                {
                    source: '猪八戒',
                    target: '福陵山云栈洞',
                    name: '居住地',
                },
                {
                    source: '卵二姐',
                    target: '福陵山云栈洞',
                    name: '居住地',
                },
                {
                    source: '唐太宗',
                    target: '大唐',
                    name: '居住地',
                },
                {
                    source: '双叉岭',
                    target: '大唐',
                    name: '位于',
                },
                {
                    source: '红孩儿',
                    target: '号山枯松涧火云洞',
                    name: '居住地',
                },
                {
                    source: '金鼻白毛老鼠精',
                    target: '哪吒',
                    name: '义兄',
                },
                {
                    source: '托塔天王',
                    target: '哪吒',
                    name: '子女',
                },
                {
                    source: '托塔天王',
                    target: '木吒',
                    name: '子女',
                },
                {
                    source: '哪吒',
                    target: '木吒',
                    name: '哥哥',
                },
                {
                    source: '托塔天王',
                    target: '金吒',
                    name: '子女',
                },
                {
                    source: '哪吒',
                    target: '金吒',
                    name: '哥哥',
                },
                {
                    source: '哪吒',
                    target: '陈塘关',
                    name: '居住地',
                },
                {
                    source: '哪吒',
                    target: '太乙真人',
                    name: '师父',
                },
                {
                    source: '阿难',
                    target: '如来佛祖',
                    name: '师父',
                },
                {
                    source: '金蝉子',
                    target: '如来佛祖',
                    name: '师父',
                },
                {
                    source: '金翅大鹏雕',
                    target: '如来佛祖',
                    name: '主人',
                },
                {
                    source: '迦叶',
                    target: '如来佛祖',
                    name: '师父',
                },
                {
                    source: '弥勒佛',
                    target: '如来佛祖',
                    name: '师父',
                },
                {
                    source: '大力金刚',
                    target: '如来佛祖',
                    name: '上司',
                },
                {
                    source: '四大菩萨',
                    target: '如来佛祖',
                    name: '上司',
                },
                {
                    source: '哪吒',
                    target: '如来佛祖',
                    name: '师父',
                },
                {
                    source: '鱼肚将',
                    target: '托塔天王',
                    name: '上司',
                },
                {
                    source: '金鼻白毛老鼠精',
                    target: '托塔天王',
                    name: '义父',
                },
                {
                    source: '药叉将',
                    target: '托塔天王',
                    name: '上司',
                },
                {
                    source: '巨灵神',
                    target: '托塔天王',
                    name: '上司',
                },
                {
                    source: '哪吒',
                    target: '托塔天王',
                    name: '父亲',
                },
                {
                    source: '陈光蕊',
                    target: '唐僧',
                    name: '儿子',
                },
                {
                    source: '猪八戒',
                    target: '唐僧',
                    name: '师父',
                },
                {
                    source: '沙悟净',
                    target: '唐僧',
                    name: '师父',
                },
                {
                    source: '殷温娇',
                    target: '唐僧',
                    name: '儿子',
                },
                {
                    source: '小白龙',
                    target: '唐僧',
                    name: '师父',
                },
                {
                    source: '孙悟空',
                    target: '唐僧',
                    name: '师父',
                },
                {
                    source: '唐僧',
                    target: '金蝉子',
                    name: '前世',
                },
                {
                    source: '鼍龙怪',
                    target: '小白龙',
                    name: '表兄弟',
                },
                {
                    source: '西海龙王',
                    target: '小白龙',
                    name: '子女',
                },
                {
                    source: '猪八戒',
                    target: '小白龙',
                    name: '师弟',
                },
                {
                    source: '沙悟净',
                    target: '小白龙',
                    name: '师弟',
                },
                {
                    source: '孙悟空',
                    target: '小白龙',
                    name: '师弟',
                },
                {
                    source: '唐僧',
                    target: '小白龙',
                    name: '徒弟',
                },
                {
                    source: '猪八戒',
                    target: '沙悟净',
                    name: '师弟',
                },
                {
                    source: '小白龙',
                    target: '沙悟净',
                    name: '师兄',
                },
                {
                    source: '孙悟空',
                    target: '沙悟净',
                    name: '师弟',
                },
                {
                    source: '奔波儿灞',
                    target: '沙悟净',
                    name: '终结者',
                },
                {
                    source: '唐僧',
                    target: '沙悟净',
                    name: '徒弟',
                },
                {
                    source: '高士廉',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '许敬宗',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '袁天罡',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '虞世南',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '薛仁贵',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '萧瑀',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '秦叔宝',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '王圭',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '殷开山',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '段志贤',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '杜如晦',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '李淳风',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '护国公',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '房玄龄',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '徐世勣',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '张士衡',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '尉迟公',
                    target: '唐太宗',
                    name: '上司',
                },
                {
                    source: '唐僧',
                    target: '唐太宗',
                    name: '御兄',
                },
                {
                    source: '殷温娇',
                    target: '陈光蕊',
                    name: '丈夫',
                },
                {
                    source: '唐僧',
                    target: '陈光蕊',
                    name: '父亲',
                },
                {
                    source: '李翠莲',
                    target: '李玉英',
                    name: '转世',
                },
                {
                    source: '唐太宗',
                    target: '李玉英',
                    name: '妹妹',
                },
                {
                    source: '唐太宗',
                    target: '李渊',
                    name: '父亲',
                },
                {
                    source: '王灵官',
                    target: '佑圣真君',
                    name: '上司',
                },
                {
                    source: '四圣真君',
                    target: '佑圣真君',
                    name: '组成',
                },
                {
                    source: '四圣真君',
                    target: '天佑元帅',
                    name: '组成',
                },
                {
                    source: '猪八戒',
                    target: '天蓬元帅',
                    name: '前世',
                },
                {
                    source: '四圣真君',
                    target: '天蓬元帅',
                    name: '组成',
                },
                {
                    source: '四圣真君',
                    target: '翊圣真君',
                    name: '组成',
                },
                {
                    source: '四大天师',
                    target: '丘弘济',
                    name: '组成',
                },
                {
                    source: '四大天师',
                    target: '张道陵',
                    name: '组成',
                },
                {
                    source: '四大天师',
                    target: '葛仙翁',
                    name: '组成',
                },
                {
                    source: '四大天师',
                    target: '许旌阳',
                    name: '组成',
                },
                {
                    source: '四大天王',
                    target: '增长天王',
                    name: '组成',
                },
                {
                    source: '四大天王',
                    target: '多闻天王',
                    name: '组成',
                },
                {
                    source: '四大天王',
                    target: '广目天王',
                    name: '组成',
                },
                {
                    source: '四大天王',
                    target: '持国天王',
                    name: '组成',
                },
                {
                    source: '青毛狮子怪',
                    target: '文殊菩萨',
                    name: '主人',
                },
                {
                    source: '狮猁怪',
                    target: '文殊菩萨',
                    name: '主人',
                },
                {
                    source: '四大菩萨',
                    target: '文殊菩萨',
                    name: '组成',
                },
                {
                    source: '黄牙老象',
                    target: '普贤菩萨',
                    name: '主人',
                },
                {
                    source: '四大菩萨',
                    target: '普贤菩萨',
                    name: '组成',
                },
                {
                    source: '黑熊精',
                    target: '观音菩萨',
                    name: '主人',
                },
                {
                    source: '赛太岁',
                    target: '观音菩萨',
                    name: '主人',
                },
                {
                    source: '红孩儿',
                    target: '观音菩萨',
                    name: '师父',
                },
                {
                    source: '灵感大王',
                    target: '观音菩萨',
                    name: '主人',
                },
                {
                    source: '木吒',
                    target: '观音菩萨',
                    name: '师父',
                },
                {
                    source: '四大菩萨',
                    target: '观音菩萨',
                    name: '组成',
                },
                {
                    source: '四部神祇',
                    target: '云童',
                    name: '组成',
                },
                {
                    source: '四部神祇',
                    target: '雷将',
                    name: '组成',
                },
                {
                    source: '四部神祇',
                    target: '风伯',
                    name: '组成',
                },
                {
                    source: '小张太子',
                    target: '大圣国师王菩萨',
                    name: '师父',
                },
                {
                    source: '大圣国师王菩萨',
                    target: '盱眙山',
                    name: '居住地',
                },
                {
                    source: '大圣国师王菩萨',
                    target: '小张太子',
                    name: '徒弟',
                },
                {
                    source: '大圣国师王菩萨',
                    target: '四大神将',
                    name: '手下',
                },
                {
                    source: '玉兔精',
                    target: '天竺国公主',
                    name: '摄藏',
                },
                {
                    source: '天竺国公主',
                    target: '素娥仙子',
                    name: '前世',
                },
                {
                    source: '银角大王',
                    target: '太上老君',
                    name: '主人',
                },
                {
                    source: '金角大王',
                    target: '太上老君',
                    name: '主人',
                },
                {
                    source: '独角兕大王',
                    target: '太上老君',
                    name: '主人',
                },
                {
                    source: '红孩儿',
                    target: '如意真仙',
                    name: '叔叔',
                },
                {
                    source: '牛魔王',
                    target: '如意真仙',
                    name: '弟弟',
                },
                {
                    source: '如意真仙',
                    target: '西梁女国',
                    name: '国籍',
                },
                {
                    source: '如意真仙',
                    target: '解阳山聚仙庵破儿洞',
                    name: '居住地',
                },
                {
                    source: '如来佛祖',
                    target: '大雷音寺',
                    name: '居住地',
                },
                {
                    source: '如来佛祖',
                    target: '孔雀大明王菩萨',
                    name: '母亲',
                },
                {
                    source: '玉兔精',
                    target: '嫦娥仙子',
                    name: '主人',
                },
                {
                    source: '孙悟空',
                    target: '镇元子',
                    name: '义兄弟',
                },
                {
                    source: '孙悟空',
                    target: '弼马温',
                    name: '别名',
                },
                {
                    source: '孙悟空',
                    target: '水帘洞',
                    name: '居住地',
                },
                {
                    source: '孙悟空',
                    target: '菩提祖师',
                    name: '师父',
                },
                {
                    source: '孙悟空',
                    target: '玉华城大王子',
                    name: '弟子',
                },
                {
                    source: '拂云叟',
                    target: '孤直公',
                    name: '同僚',
                },
                {
                    source: '熊山君',
                    target: '寅将军',
                    name: '朋友',
                },
                {
                    source: '盱眙山',
                    target: '南赡部洲',
                    name: '位于',
                },
                {
                    source: '淮河',
                    target: '南赡部洲',
                    name: '位于',
                },
                {
                    source: '小张太子',
                    target: '南赡部洲',
                    name: '居住地',
                },
                {
                    source: '黄眉大王',
                    target: '弥勒佛',
                    name: '主人',
                },
                {
                    source: '小张太子',
                    target: '弥勒佛',
                    name: '师父',
                },
                {
                    source: '鼍龙怪',
                    target: '摩昂太子',
                    name: '表兄弟',
                },
                {
                    source: '西海龙王',
                    target: '摩昂太子',
                    name: '子女',
                },
                {
                    source: '小白龙',
                    target: '摩昂太子',
                    name: '哥哥',
                },
                {
                    source: '黄牙老象',
                    target: '金翅大鹏雕',
                    name: '结义兄弟',
                },
                {
                    source: '小钻风',
                    target: '金翅大鹏雕',
                    name: '上司',
                },
                {
                    source: '黄牙老象',
                    target: '青毛狮子怪',
                    name: '结义兄弟',
                },
                {
                    source: '金翅大鹏雕',
                    target: '青毛狮子怪',
                    name: '结义兄弟',
                },
                {
                    source: '小钻风',
                    target: '青毛狮子怪',
                    name: '上司',
                },
                {
                    source: '青毛狮子怪',
                    target: '黄牙老象',
                    name: '结义兄弟',
                },
                {
                    source: '小钻风',
                    target: '黄牙老象',
                    name: '上司',
                },
                {
                    source: '小钻风',
                    target: '狮驼国',
                    name: '国籍',
                },
                {
                    source: '小钻风',
                    target: '狮驼岭狮驼洞',
                    name: '居住地',
                },
                {
                    source: '黄眉大王',
                    target: '小雷音寺',
                    name: '居住地',
                },
                {
                    source: '黄袍怪',
                    target: '宝象国',
                    name: '国籍',
                },
                {
                    source: '碗子山波月洞',
                    target: '宝象国',
                    name: '位于',
                },
                {
                    source: '平顶山莲花洞',
                    target: '宝象国',
                    name: '位于',
                },
                {
                    source: '斑衣鳜婆',
                    target: '灵感大王',
                    name: '义兄',
                },
                {
                    source: '白鼋',
                    target: '通天河',
                    name: '居住地',
                },
                {
                    source: '灵感大王',
                    target: '通天河',
                    name: '居住地',
                },
                {
                    source: '斑衣鳜婆',
                    target: '通天河',
                    name: '居住地',
                },
                {
                    source: '蝎子精',
                    target: '昴日星官',
                    name: '终结者',
                },
                {
                    source: '毗蓝婆菩萨',
                    target: '昴日星官',
                    name: '儿子',
                },
                {
                    source: '昴日星官',
                    target: '光明宫',
                    name: '居住地',
                },
                {
                    source: '蜈蚣精',
                    target: '毗蓝婆菩萨',
                    name: '主人',
                },
                {
                    source: '昴日星官',
                    target: '毗蓝婆菩萨',
                    name: '母亲',
                },
                {
                    source: '黄牙老象',
                    target: '六牙白象',
                    name: '别名',
                },
                {
                    source: '普贤菩萨',
                    target: '六牙白象',
                    name: '坐骑',
                },
                {
                    source: '獬豸洞先锋',
                    target: '赛太岁',
                    name: '上司',
                },
                {
                    source: '獬豸洞',
                    target: '赛太岁',
                    name: '主人',
                },
                {
                    source: '有来有去',
                    target: '赛太岁',
                    name: '上司',
                },
                {
                    source: '麒麟山獬豸洞',
                    target: '朱紫国',
                    name: '位于',
                },
                {
                    source: '紫阳真人',
                    target: '朱紫国',
                    name: '居住地',
                },
                {
                    source: '盘丝岭盘丝洞',
                    target: '朱紫国',
                    name: '位于',
                },
                {
                    source: '朱紫国王后',
                    target: '朱紫国',
                    name: '国籍',
                },
                {
                    source: '朱紫国国王',
                    target: '朱紫国',
                    name: '国籍',
                },
                {
                    source: '有来有去',
                    target: '朱紫国',
                    name: '国籍',
                },
                {
                    source: '赛太岁',
                    target: '麒麟山獬豸洞',
                    name: '居住地',
                },
                {
                    source: '有来有去',
                    target: '麒麟山獬豸洞',
                    name: '居住地',
                },
                {
                    source: '赛太岁',
                    target: '朱紫国王后',
                    name: '掳走',
                },
                {
                    source: '紫阳真人',
                    target: '朱紫国王后',
                    name: '保护',
                },
                {
                    source: '朱紫国国王',
                    target: '朱紫国王后',
                    name: '妻子',
                },
                {
                    source: '白鹿精',
                    target: '柳林坡清华洞',
                    name: '居住地',
                },
                {
                    source: '陷空山无底洞',
                    target: '比丘国',
                    name: '位于',
                },
                {
                    source: '比丘国国王',
                    target: '比丘国',
                    name: '国籍',
                },
                {
                    source: '柳林坡清华洞',
                    target: '比丘国',
                    name: '位于',
                },
                {
                    source: '殷温娇',
                    target: '殷开山',
                    name: '父亲',
                },
                {
                    source: '陈光蕊',
                    target: '殷温娇',
                    name: '妻子',
                },
                {
                    source: '蝎子精',
                    target: '毒敌山琵琶洞',
                    name: '居住地',
                },
                {
                    source: '毒敌山琵琶洞',
                    target: '女儿国',
                    name: '位于',
                },
                {
                    source: '毗蓝婆菩萨',
                    target: '紫云山千花洞',
                    name: '居住地',
                },
                {
                    source: '水猿大圣',
                    target: '淮河',
                    name: '居住地',
                },
                {
                    source: '沙悟净',
                    target: '卷帘大将',
                    name: '前世',
                },
                {
                    source: '沙悟净',
                    target: '流沙河',
                    name: '居住地',
                },
                {
                    source: '鼍龙怪',
                    target: '泾河龙王',
                    name: '父亲',
                },
                {
                    source: '泾河龙王',
                    target: '鼍龙怪',
                    name: '儿子',
                },
                {
                    source: '泾河龙王',
                    target: '西海龙王之妹',
                    name: '妻子',
                },
                {
                    source: '泾河龙王',
                    target: '死亡',
                    name: '结局',
                },
                {
                    source: '混世魔王',
                    target: '傲来国',
                    name: '国籍',
                },
                {
                    source: '混世魔王',
                    target: '坎源山水脏洞',
                    name: '居住地',
                },
                {
                    source: '灭法国',
                    target: '灭法国国王',
                    name: '主人',
                },
                {
                    source: '黄风怪',
                    target: '灵吉菩萨',
                    name: '主人',
                },
                {
                    source: '灵吉菩萨',
                    target: '小须弥山',
                    name: '居住地',
                },
                {
                    source: '虎先锋',
                    target: '黄风怪',
                    name: '上司',
                },
                {
                    source: '灵吉菩萨',
                    target: '黄风怪',
                    name: '收服',
                },
                {
                    source: '特处士',
                    target: '熊山君',
                    name: '朋友',
                },
                {
                    source: '熊山君',
                    target: '特处士',
                    name: '朋友',
                },
                {
                    source: '牛魔王',
                    target: '避水金晶兽',
                    name: '坐骑',
                },
                {
                    source: '牛魔王',
                    target: '积雷山',
                    name: '居住地',
                },
                {
                    source: '金角大王',
                    target: '狐阿七',
                    name: '舅舅',
                },
                {
                    source: '独角兕大王',
                    target: '金兜山金兜洞',
                    name: '居住地',
                },
                {
                    source: '独角鬼王',
                    target: '花果山',
                    name: '居住地',
                },
                {
                    source: '高太公',
                    target: '高翠兰',
                    name: '女儿',
                },
                {
                    source: '猪八戒',
                    target: '高翠兰',
                    name: '妻子',
                },
                {
                    source: '玉华王',
                    target: '玉华州',
                    name: '居住地',
                },
                {
                    source: '黑熊精',
                    target: '白花蛇精',
                    name: '朋友',
                },
                {
                    source: '黑熊精',
                    target: '苍狼精',
                    name: '朋友',
                },
                {
                    source: '白花蛇精',
                    target: '苍狼精',
                    name: '好友',
                },
                {
                    source: '金池长老',
                    target: '黑熊精',
                    name: '好友',
                },
                {
                    source: '白花蛇精',
                    target: '黑熊精',
                    name: '好友',
                },
                {
                    source: '白雄尊者',
                    target: '燃灯古佛',
                    name: '师父',
                },
                {
                    source: '白鹿精',
                    target: '白面狐狸',
                    name: '义女',
                },
                {
                    source: '白骨精',
                    target: '白虎岭白骨洞',
                    name: '居住地',
                },
                {
                    source: '黄袍怪',
                    target: '百花羞',
                    name: '妻子',
                },
            ],
        },
    ],
};

app.plugins.plugins['obsidian-echarts'].render(option, this.container)

```

