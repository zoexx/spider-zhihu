// 导出为CSV之前 修改一下标题 以及顺序
let fs = require("fs");

let dataList = require('./afterFormat.json');
console.info('get dataList length: ' + dataList.length );

const titleMap = {
	title         : '问题标题' ,
	tags   	      : '问题所属话题' ,
	viewAmount    : '问题被浏览' ,
	followAmount  : '问题被关注' , 
	topicUrl	  : '问题地址' ,
	answerDigest  : '回答摘要' ,
	answerUrl     : '回答链接' ,
	commentAmount : '回答评论数' ,
	vote		  : '回答赞同数' ,
	author 		  : '回答作者' ,
	authorHome 	  : '回答作者主页' ,
	badge  		  : '作者徽章' ,
	badgeSummary  : '作者徽章摘要' ,
	bio           : '作者个人简介' ,
	publishTime   : '回答发布时间' ,
	updateTime    : '回答更新时间' ,
}


let result = dataList.map( item => {
	let keys = Object.keys( item );
	let newItem = {}
	!item.author ? item.author = '匿名' : null ;
	keys.map( key =>{
		newItem[ titleMap[key] || key ] = item[key]
	})
	return newItem ;
})

let filetitle = 'afterTitleFormat.json' ;

fs.writeFile( filetitle , JSON.stringify( result ) , 'utf8' , function(err){
  if (err) throw err;
  console.log('The file has been saved!');
});
console.log('finished write');

