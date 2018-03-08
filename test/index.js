var fakeData ={
			"result": 1,
			"mstList": [],
			"sumList":[],
			"log": "操作成功"
	}
	var getData = function (idx) {
		var o = {
			"color": "<a href='###'>C6E579</a>",
			"dnByteStr": "0.465",
			"dnDisByteStr": "0.046",
			"dnMaxBpsStr": "0.021",
			"dnMinBpsStr": "0.000",
			"dnPassByteStr":"",
			"icon" : [
				{
					"color":"red",
					"state":true,
					"info":"红灯"
				}
			],
			"id": 12,
			"indexStr": "1",
			"maxBpsStr": "0.043",
			"minBpsStr": "0.000",
			"name": idx + "汇总",
			"totalBpsStr": {"aa":{"bb":{"cc":["aa","bb"]}}},
			"totalByteStr": "0.930",
			"totalPassByteStr": "0.837",
			"totalPassPerStr": "90.0",
			"totalPerStr": "6.9",
			"upByteStr": Math.random(),
			"upDisByteStr": "0.046",
			"upMaxBpsStr": 0.021,
			"upMinBpsStr": "0.000",
			"upPassByteStr": "0.418"
		};
		o["indexStr"]  = Math.random()>0.5;
		o["dnPassByteStr"] = o["upByteStr"];
		o['dnByteStr'] =  o["upByteStr"];
		o['maxBpsStr'] =   Math.abs(Math.random()*10).toFixed(Math.abs(Math.random()*10));
		o['upMaxBpsStr'] =   Math.abs(Math.random()*10).toFixed(Math.abs(Math.random()*10));
		o['icon'] = (function (argument) {
			var idx = Math.abs(Math.random()*10),list=[],colorList = ['red','green','blue','yellow'];
			for (var i = 0; i < idx; i++) {
				var color = colorList[Math.round(Math.random()*3)]
				list.push({
					"color":color,
					"state":true,
					"info":"描述"+color
				})
			}
			return list;
		})()
		return o;
	}
	for (var i = 0; i < 1000; i++) {
		fakeData["mstList"].push(getData(i))
	};
	var fakeRes = {data:fakeData["mstList"].slice(0,20),dataTotal:1000}
// mock data
	$.mockjax({
			url: 'loadData',
			response:function (settings) {
				var param = settings.data,
						cpage = param.currentPage,
						pageSize = param.pageSize,
						total = 72,
						size = Math.min(total-pageSize*(cpage-1),pageSize),
						list = [];
				for (var i = 0; i < size; i++) {
					list.push(getData(i));
				}
				var res = {
				    "result": 1,
				    "pagination": {
				        "dataTotal": 72,
				        "list": list,
								"extList" : [],
				        "pageNumber": cpage
				    },
				    "log": "操作成功"
				}
				this.responseText = res;
			}
		});
		$.mockjax({
				url: 'loadDataNoPage',
				response:function (settings) {
					var param = settings.data,
							list = [];
					for (var i = 0; i < 1000; i++) {
						list.push(getData());
					}
					var res = {
					    "result": 1,
					    "list": list,
					    "log": "操作成功"
					}
					this.responseText = res;
				}
			});
function sortFnTest(currRowData,nextRowData,sortFlag,sortKey) {
	var currVal = Number(currRowData[sortKey].replace(/[^\d]/g,"")),
			nextVal = Number(nextRowData[sortKey].replace(/[^\d]/g,"")),
			flag;
	var f = sortFlag == 2 ? currVal > nextVal : nextVal > currVal  ;
	if(nextVal == currVal){
		flag = 0;
	}else{
		flag = f ? -1 : 1;
	}
	return flag;
}
function fomatterOperaCol(value,$td,rowData){
  var $btn = $("<a href='javascript:;'>"+value+"</a>")
  $btn[0].oncontextmenu = function () {return false; } //禁用右键
  return $btn;
}

function fmtIcon(iconList,$td,rowData) {
	 $td.qtip({
	 	content : renderTipInfo(iconList),
		position : {my:"left center",at:"right center",adjust: { target: $(document), resize: true,method:"flipinvert"  }},
		hide: {fixed: true,delay: 300}
	 })
	var str = "";
	var len = iconList.length;
	if(len > 4){
		var splitIdx = Math.round(len/2);
		str += "<div style='line-height: 14px;text-align: center;'>";
		str += loopIcon(iconList.slice(0,splitIdx));
		str += "</div><div style='line-height: 14px;text-align: center;'>";
		str += loopIcon(iconList.slice(splitIdx));
	}else{
		str += "<div style='text-align: center;'>";
		str += loopIcon(iconList);
	}
	str += "</div>"
	return str;
}

function loopIcon(iconList) {
	var str = "";
	$.each(iconList,function (i,icon) {
		str += renderIcon(icon);
	})
	return str;
}

function renderTipInfo(iconList) {
	var str = "<div class='qtip-list-content'><ul style='list-style:none;padding-left:0;' class='qtip-list-ul'>";
	$.each(iconList,function (i,icon) {
		str += "<li>"
		str += renderIcon(icon)
		str += icon.info
		str += "</li>"
	})
	str += "</ul></div>"
	return str;
}

function renderIcon(icon) {
	var color = "";
	switch (icon.color) {
		case "red":
		color = "#e54957";
			break;
		case "blue":
		color = "#5086de"
			break;
		case "green":
		color = "#4cc17b"
			break;
		case "yellow":
		color = "#FFA500"
			break;
		default:
			break;
	}
	return "<span class='icon-circle icon-m-r' style ='color:"+color+"'></span>"
}

function fmtStr(value,$td,rowData) {
	return value+"MB";
}

function onGridQuery(keyword,rows) {//行过滤暴露的接口
	if (!!!keyword) {//输入空内容时，返回原行
		return rows;
	}
	var outRows = [];//输出的行
	$.each(rows,function(i, row) {
		var d = row.data,//获取行源数据
				name = d.name;//按行数据的name来过滤
		if (name.indexOf(keyword)>-1) {
			outRows.push(row);
		}
	});
	return outRows;
}
