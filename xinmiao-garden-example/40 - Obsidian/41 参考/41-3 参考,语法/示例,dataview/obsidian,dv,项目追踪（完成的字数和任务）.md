---
obsidianUIMode: "preview"
---

**◀️ [[40 - Obsidian]]>[[41 参考]]>[[41-3 参考,语法]]>[[示例,dataview]]📎 [[obsidian,插件,dataview]]**

🪁 status:  #🏷️ #🔖
🎏 class: #📇  #📸

##### 使用说明
- 可以根据文件夹或者标签筛选项目文件，如果仅仅想根据标签筛选，文件夹选择空即可。**支持多选**
- 如果项目中有任务会显示任务数量以及完成情况，否则只显示字数。
- 在项目文件yaml区域添加target 可设置目标字数，如果没有设置，默认读取本文配置的默认值3500
- 项目状态通过文件status字段显示，如果没有默认显示空。



%%
Filename filter
searchText:: 
__Notes to display__
*Gets either notes in a folder or notes with a certain tag. Leave one of them empty.*
sourceFolder:: "20 - 流"
sourceTag:: 

__Notes to exclude__
*Leave empty to disable. Notes with the yaml-key `status` and value `exclude` for that key are also excluded.)*
excludeTag:: 
exFolder:: 50 - 知识卡片,00 - 计划记录,40 - Obsidian,10 - 人员管理,60 - 知识体系
__Counting Settings__
*"chars" or "words"*
toCount:: words
target:: 3500

*words or characters per page, depending on setting above. Set to zero to ignore.*
wordsPerPage:: 350
charsPerPage:: 1000

includeFootnotes:: true
charactersIncludeSpaces:: true
excludeComments:: true
cumulativeShare:: false
groupedCount:: true

__Purely visual__
useThousandSeperator:: true
thousandSeperator:: ,
naChar:: —
mostRecentIcon:: 🕙

%%
##### 选择需要跟踪的项目
```dataviewjs
const {update} = this.app.plugins.plugins["metaedit"].api;
	const thisFile = dv.pages().where(f => f.file.path == dv.current().file.path)
	let searchText = dv.current().searchText??'';
	let sourceFolder = dv.current().sourceFolder??'';
	let exFolder = dv.current().exFolder??'';	
	let sourceTag = dv.current().sourceTag??'';
	let excludeTag =  dv.current().excludeTag??'';
const inputMaker = (pn, fpath) => {
	const file = this.app.vault.getAbstractFileByPath(fpath)
	const input = this.container.createEl('input');
	input.setAttribute("name", "input")
	input.setAttribute("id", "searchText")
	input.setAttribute("placeholder", "输入文字后回车开始过滤")
	input.setAttribute("value", searchText)
	const input_text=this.container.querySelector("#filename_text")?.value;
	input.addEventListener('keyup', async function(event){
	event.preventDefault();
    if (event.keyCode === 13) {
    await update(pn, this.value, file)
    }
	});
	return input
	}
	const searchFolerDropdownMaker = (pn, fpath) => {
		const file = this.app.vault.getAbstractFileByPath(fpath)
		const folders = this.app.vault.getAllLoadedFiles().filter(i => i.children).map(folder => folder.path);
		folders.unshift("")
		const dropdown = this.container.createEl('select');
		dropdown.setAttribute("multip", ""); 
		dropdown.setAttribute("id", "folder"); 
		folders.forEach((folder, index) => {
			var opt = folder;
			var el = dropdown.createEl('option');
			opt != "/" ? el.textContent = opt : el.textContent = "All folder";
	let sourceFolder_arr=sourceFolder?.split(',')
	sourceFolder_arr?.forEach((value) => {
		opt===(value)?el.setAttribute("choose", ""):''
		})		
			el.value = opt;
			dropdown.appendChild(el);
		})
		folders.indexOf(sourceFolder) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = folders.indexOf(sourceFolder)
	dropdown.addEventListener('change', async evt => {
	evt.preventDefault();
	const dom_folder = this.container.querySelector('#folder');
	const folder_select=dom_folder.querySelectorAll("[hidden]")[0]?.value;
	
	let folder_select_arr_res=[]
	let folder_select_arr=	folder_select.split(',')
	for (var i = 0; i < folder_select_arr.length; i++) {
   if(folder_select_arr[i] ===  "")
    { folder_select_arr_res=[""]
    break;}
    else{
folder_select_arr_res.push(folder_select_arr[i])
    }}
	if(folder_select_arr_res.indexOf('/')> -1) 
	{if (folder_select_arr_res.length>1)
		{if(folder_select_arr_res.indexOf('/')=== 0) 
				folder_select_arr_res.shift();
			else
				folder_select_arr_res=['/'];}
		}
	await update(pn, folder_select_arr_res.join(), file)
		})
		
		return dropdown
	}
	const exFolerDropdownMaker = (pn, fpath) => {
		const file = this.app.vault.getAbstractFileByPath(fpath)
		const folders = this.app.vault.getAllLoadedFiles().filter(i => i.children).map(folder => folder.path);
		folders.unshift("")
		const dropdown = this.container.createEl('select');
		dropdown.setAttribute("multip", ""); 
		dropdown.setAttribute("id", "exfolder"); 
		folders.forEach((folder, index) => {
			var opt = folder;
			var el = dropdown.createEl('option');
			opt != "/" ? el.textContent = opt : el.textContent = "All folder";
	let exFolder_arr=exFolder?.split(',')
	exFolder_arr?.forEach((value) => {
		opt===(value)?el.setAttribute("choose", ""):''
		})		
			el.value = opt;
			dropdown.appendChild(el);
		})
		folders.indexOf(exFolder) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = folders.indexOf(exFolder)
	dropdown.addEventListener('change', async evt => {
	evt.preventDefault();
	const dom_folder = this.container.querySelector('#exfolder');
	const exfolder_select=dom_folder.querySelectorAll("[hidden]")[0]?.value;
	let exfolder_select_arr_res=[]
	let exfolder_select_arr=	exfolder_select.split(',')
	for (var i = 0; i < exfolder_select_arr.length; i++) {
   if(exfolder_select_arr[i] ===  "")
    { exfolder_select_arr_res=[""]
    break;}
    else{
exfolder_select_arr_res.push(exfolder_select_arr[i])
    }}
	if(exfolder_select_arr_res.indexOf('/')> -1) 
	{if (exfolder_select_arr_res.length>1)
		{if(exfolder_select_arr_res.indexOf('/')=== 0) 
				exfolder_select_arr_res.shift();
			else
				exfolder_select_arr_res=['/'];}
		}
	await update(pn, exfolder_select_arr_res.join(), file)
		})
		
		
		return dropdown
	}
///////
	const tagsDropdownMaker = (pn, fpath) => {
		const file = this.app.vault.getAbstractFileByPath(fpath)
		const tags = Object.keys(app.metadataCache.getTags()).sort();
		tags.unshift("#")
		const dropdown = this.container.createEl('select');
		dropdown.setAttribute("multip", ""); 
		dropdown.setAttribute("id", "tags"); 
		tags.forEach((tag, index) => {
			var opt = tag;
			var el = dropdown.createEl('option');
			opt != "#" ? el.textContent = opt : el.textContent = "All Tags";
	let sourceTag_arr=sourceTag.split(',')
	sourceTag_arr.forEach((value) => {
		opt===("#"+value)?el.setAttribute("choose", ""):''
		})
			el.value = opt;
			dropdown.appendChild(el);
		})
		tags.indexOf("#"+sourceTag) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = tags.indexOf("#"+sourceTag)
		dropdown.addEventListener('change', async evt => {
			evt.preventDefault();
		const dom_tags = this.container.querySelector('#tags');
			const tag_select=dom_tags.querySelectorAll("[hidden]")[0]?.value;
let tag_select_arr=	tag_select.split(',')
		let tag_select_arr_res=[]
		tag_select_arr.forEach((value) => {
		if(value!='#')
			{
			value=value.replace("#","");
			tag_select_arr_res.push(value)
			}else
			{
			tag_select_arr_res=[]
			}
		})	
		await update(pn, tag_select_arr_res.join(), file)		
			//await update(pn, tags[dropdown.selectedIndex].slice(1), file)
		})
		return dropdown
	}
//////
	const extagsDropdownMaker = (pn, fpath) => {
		const file = this.app.vault.getAbstractFileByPath(fpath)
		const tags = Object.keys(app.metadataCache.getTags()).sort();
		const dropdown = this.container.createEl('select');
		dropdown.setAttribute("multip", ""); 
		dropdown.setAttribute("id", "extags"); 
		tags.unshift("")
		tags.forEach((tag, index) => {
			var opt = tag;
			var el = dropdown.createEl('option');
		opt != "#" ? el.textContent = opt : el.textContent = "All Tags";
	let excludeTag_arr=excludeTag.split(',')
	excludeTag_arr.forEach((value) => {
		opt===("#"+value)?el.setAttribute("choose", ""):''
		})
			el.value = opt;
			dropdown.appendChild(el);
		})
		tags.indexOf("#"+excludeTag) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = tags.indexOf("#"+excludeTag)
		dropdown.addEventListener('change', async evt => {
			evt.preventDefault();
		const dom_tags = this.container.querySelector('#extags');
			const excludeTag_select=dom_tags.querySelectorAll("[hidden]")[0]?.value;
let excludeTag_select_arr=	excludeTag_select.split(',')
		let excludeTag_select_arr_res=[]
		excludeTag_select_arr.forEach((value) => {
		if(value!='')
			{
			value=value.replace("#","");
			excludeTag_select_arr_res.push(value)
			}else
			{
			excludeTag_select_arr_res=[]
			}
		})	
		await update(pn, excludeTag_select_arr_res.join(), file)		
			//await update(pn, tags[dropdown.selectedIndex].slice(1), file)
		})	
		
		return dropdown;
	}	
/////
dv.el("dvjs", "");
    dv.el("b", "按文件夹检索:&ensp;", {
        attr: { "style": "font-size:1em;display: inline-table" },
    });
    dv.el("b", searchFolerDropdownMaker('sourceFolder', dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
	 dv.el("b", "按标签检索:&ensp;", {
	        attr: { "style": "font-size:1em;display: inline-table" },
	    });
	dv.el("b", tagsDropdownMaker('sourceTag', dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
    dv.el("br")
	 dv.el("b", "排除的文件夹:&ensp;", {
	        attr: { "style": "font-size:1em;display: inline-table" },
	    });
	dv.el("b", exFolerDropdownMaker('exFolder', dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
	 dv.el("b", "排除的标签:&ensp;", {
	        attr: { "style": "font-size:1em;display: inline-table" },
	    });
	dv.el("b", extagsDropdownMaker('excludeTag', dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
    dv.el("br")
     dv.el("b", "按文件名过滤:&ensp;", {
	        attr: { "style": "font-size:1em;display: inline-table" },
	    });
	dv.el("b", inputMaker('searchText', dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
	dv.paragraph(`\`button-table2csv\``)

const script = this.container.createEl('script');
script.text = `(function() {
		selectMultip = {
			register: function(id) {
					document.querySelectorAll("[multip]:not(#filter_tags)").forEach(function(e) {
					render(e);
				})
			},
			reload: function(id, data, setData) {
				var htm = "";
				for(var i = 0; i < data.length; i++) {
					htm += '<option value="' + data[i].value + '">' + data[i].text + '</option>'
				}
				var e = document.getElementById(id);
				e.innerHTML = htm;
				render(e);
				this.setVal(id, setData);
			},
			setVal: function(id, str) {
				var type = Object.prototype.toString.call(str);
				switch(type) {
					case "[object String]":
						document.getElementById(id).val = str;
						break;
					case "[object Array]":
						document.getElementById(id).val = str.toString();
						break;
					default:
						break;
				}
			},
			getVal: function(id) {
				return document.getElementById(id).val;
			},
 
		}
 
		function render(e) {
			e.param = {
				arr: [],
				valarr: [],
				opts: []
			};
			var choosevalue = "",
				op;
			for(var i = 0; i < e.length; i++) {
				op = e.item(i);
				e.param.opts.push(op);
				if(op.hasAttribute("choose")) {
					if(choosevalue == "") {
						choosevalue = op.value
					} else {
						choosevalue += "," + op.value;
					}
 
				}
			}
			var option = document.createElement("option");
			option.hidden = true;
			e.appendChild(option);
			e.removeEventListener("input", selchange);
			e.addEventListener("input", selchange);
			
			Object.defineProperty(e, "val", {
				get: function() {
					return this.querySelector("[hidden]").value;
				},
				set: function(value) {
					e.param.valarr = [];
					var valrealarr = value == "" ? [] : value.split(",");
					e.param.arr = [];
					e.param.opts.filter(function(o) {
						o.style = "";
					});
					if(valrealarr.toString()) {
						for(var i = 0; i < valrealarr.length; i++) {
							e.param.opts.filter(function(o) {
							if(o.value == valrealarr[i]) {
								o.style = "color: blue;";
								e.param.arr.push(o.text);
								e.param.valarr.push(o.value)
								}
							});
						}
						this.options[e.length - 1].text = e.param.arr.toString();
						this.options[e.length - 1].value = e.param.valarr.toString();
						this.options[e.length - 1].selected = true;
					} else {
						this.options[0].selected = true;
					}
 
				},
				configurable: true
			})
			//添加属性choose 此属性添加到option中用来指定默认值
			e.val = choosevalue;
		}
 
		function selchange() {
			var text = this.options[this.selectedIndex].text;
			var value = this.options[this.selectedIndex].value;
			this.options[this.selectedIndex].style = "color: blue;";
			var ind = this.param.arr.indexOf(text);
			if(ind > -1) {
				this.param.arr.splice(ind, 1);
				this.param.valarr.splice(ind, 1);
				this.param.opts.filter(function(o) {
					if(o.value == value) {
						o.style = "";
					}
				});
			} else {
				this.param.arr.push(text);
				this.param.valarr.push(value);
			}
			this.options[this.length - 1].text = this.param.arr.toString();
			this.options[this.length - 1].value = this.param.valarr.toString();
			if(this.param.arr.length > 0) {
			this.options[this.length - 1].selected = true;
			} else {
				this.options[0].selected = true;
			}
		}
	})();
	selectMultip.register();
	`;     	
```


```dataviewjs
//----------------------------------------------------
//  a dataviewjs snippet by @pseudometa, https://gist.github.com/chrisgrieser/ac16a80cdd9e8e0e84606cc24e35ad99
//----------------------------------------------------
// Print Table
let setting= {}
setting.container=this.container
setting.theader=["项目","标准","进度", "状态"]
dv.view("40 - Obsidian/脚本/script/dv_project_tracking", setting)

```