
// 获取url上的参数
export const getUrlParam = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　　　　　//构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);　　　　　　　 //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]); return null;　　　//返回参数值　
}


export const GetQueryByString = (str,name) => {
	// var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	// if(!str.split("?")[1])return null;
	// var r = str.split("?")[1].match(reg); //匹配目标参数
	// if (r != null) {
	// 	return decodeURIComponent(r[2]);
	//
	// }
	// return null; //返回参数值

	//获取？号出现几次
	var tempArr = str.split('?');

	// //如果大于1
	if(tempArr.length-1>1){
		var rt = null;
		for(var i in tempArr){
			var s = tempArr[i]
			var reg1 = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r1 = s.match(reg1); //匹配目标参数
			if (r1 != null) {
				rt = decodeURIComponent(r1[2]);//一直覆盖，要最后的就行了
			}
		}

		return rt
	}

	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	if(!str.split("?")[1])return null;
	var r = str.split("?")[1].match(reg); //匹配目标参数

	if (r != null) {
		return decodeURIComponent(r[2]);

	}
	return null; //返回参数值

}


export const dateCalculation = (second) => { //返回天、时、分
	if (second > 0) {
		var day = 0;
		var hour = 0;
		var minute = 0;
		var data = {};
		minute = Math.floor(second / (60*1000))
		if (parseInt(minute) > 60) {
			hour = parseInt(minute / 60);
			minute %= 60; //算出有多分钟
		}
		if (parseInt(hour) > 24) {
			day = parseInt(hour / 24);
			hour %= 24; //算出有多分钟
		}
		data.day = day;
		data.hour = hour;
		data.minute = minute;
		//debugger
		let str = ""
		if(data.day>0){
			str = data.day+"天"+data.hour+"小时"+data.minute+"分"
		}else if(data.day<1&&data.hour>0){
			str = data.hour+"小时"+data.minute+"分"
		}else{
			str = data.minute+"分"
		}
		return str;
	}
}

export const formatDate = (timeStamp) => {
	let year = new Date(timeStamp).getFullYear();
	let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
	let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
	let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
	let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
	let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
	return year + "-" + month + "-" + date ;
}
  
  

export const timeFormate = (timeStamp) => {
	let year = new Date(timeStamp).getFullYear();
	let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
	let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
	let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
	let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
	let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
	return year + "-" + month + "-" + date +" "+hh+":"+mm+':'+ss ;
}


/* 获取剩余天数 */
export const getDayNum = (endTime) =>{
	let day = new Date(endTime).getTime() - new Date().getTime();//日期转时间戳
	let dayCount = Math.floor(day / 86400000)+1 ;//时间戳获取天数
	return dayCount
}

/** 图片压缩，默认同比例压缩
 *  @param {Object} fileObj
 *  图片对象
 *  回调函数有一个参数，base64的字符串数据
 */
export function compress(fileObj, quality,callback) {
	try {
	  const image = new Image()
	  image.src = URL.createObjectURL(fileObj)
	  debugger
	  image.onload = function() {
		const that = this
		// 默认按比例压缩
		let w = that.width
		let h = that.height
		const scale = w / h
		w = fileObj.width || w
		h = fileObj.height || (w / scale)
		//let quality = 0.7 // 默认图片质量为0.7
		// 生成canvas
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		// 创建属性节点
		const anw = document.createAttribute('width')
		anw.nodeValue = w
		const anh = document.createAttribute('height')
		anh.nodeValue = h
		canvas.setAttributeNode(anw)
		canvas.setAttributeNode(anh)
		ctx.drawImage(that, 0, 0, w, h)
		// 图像质量
		/* if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
		  quality = fileObj.quality
		} */
		// quality值越小，所绘制出的图像越模糊
		const data = canvas.toDataURL('image/jpg', quality)
		// 压缩完成执行回调
		const newFile = convertBase64UrlToBlob(data)
		callback(newFile)
	  }
	} catch (e) {
	  console.log('压缩失败!')
	}
  }
  function convertBase64UrlToBlob(urlData) {
	const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
	// 处理异常,将ascii码小于0的转换为大于0
	const ab = new ArrayBuffer(bytes.length)
	const ia = new Uint8Array(ab)
	for (let i = 0; i < bytes.length; i++) {
	  ia[i] = bytes.charCodeAt(i)
	}
	return new Blob([ab], { type: 'image/png' })
  }