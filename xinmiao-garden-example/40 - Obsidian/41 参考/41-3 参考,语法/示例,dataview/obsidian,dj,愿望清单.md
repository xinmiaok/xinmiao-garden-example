---
tags: TODO
来源: [GitHub - obsidian_vault_template_for_graduate_student](https://github.com/sheldonxxd/obsidian_vault_template_for_graduate_student)
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,dataview]]📎 [[obsidian,插件,dataview]]**

🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸 

### 愿望清单

```dataviewjs
//使用时修改关键词即可 
//const term = "#TODO" 

const term = dv.current().file.tags[0]

const files = app.vault.getMarkdownFiles() 

function isJustTODO(line){
	if (line.contains(term+"/")){
		return false
	}
	else if (line.contains(term)) {
		return true
	}
	else {
		return false
	}
}

const arr = files.map(async (file) => {
	const content = await app.vault.cachedRead(file)
	const lines = content.split("\n").filter(line => isJustTODO(line))
	for (let i=0; i<lines.length; i++){
		lines[i] = `${lines[i]} 🔗[[${file.name}]]`
	}
	return lines
	}) 

Promise.all(arr).then(values => {
    //不包含本文件
    let noteArr = values.flat().filter(note => !note.includes("const term ="))
    for(let i=0; i< noteArr.length;i++){
        dv.paragraph(`${noteArr[i]}`)
    }
})

/** 参考链接
 * https://www.uncoverman.com/random-notes-in-obsidian.html
 */

```

>[!tip]
>您可以在 vault 中任意文档添加 `TODO` 标签，此页面会自动收集带有该标签的单行内容（而不是整个页面）集中显示。区别于 routine 事项（见[[日志模板]]），您可以把这种方式作为「愿望」，当然也可以使用别的标签如 `wish`，请注意在此页面的 front-matter 中对应位置将 `TODO` 替换为 `wish` 即可。已经完成的愿望，您可以修改愿望所在行的 `TODO` 标签为 `TODO/完成`。此页面可作为 dataviewjs 代码示例，可对其它标签的行内容进行抓取。
>这是一段非常有用的query代码，类似的，您可以简单的通过设置不同的标签，来收集整理一些零碎的信息，比如偶尔灵光一现出来的点子（idea）。


