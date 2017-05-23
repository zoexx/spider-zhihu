// 3秒点一次 查看更多 按钮 报错后停止

let timer = setInterval(function(){
	$('.zg-btn-white.zu-button-more')[0].click()
},3000)

window.onerror = function(e){
	clearInterval( timer );
}

// 没有新的请求后开始抓页面上的数据

let data = [];
const host = 'https://www.zhihu.com/'

$('li.item[data-type="Answer"]').map(function(index,item){
	let title = item.querySelector('a.js-title-link');
	let authorInfo = item.querySelector('div.author-line');
	let content = item.querySelector('div.entry-content');

	if ( title ){
		let itemdata = {
			title : title.innerHTML.replace(/<[^>]+>/g,"") ,
			topicUrl   : host + title.href ,
			commentAmount: item.querySelector('a.js-toggleCommentBox>span.label') && item.querySelector('a.js-toggleCommentBox>span.label').innerHTML ,
			vote : item.querySelector('a.js-vote-count') && item.querySelector('a.js-vote-count').innerHTML ,
		}
		if ( authorInfo ){
			itemdata.author=       authorInfo.querySelector('a.author-link') && authorInfo.querySelector('a.author-link').innerHTML
			itemdata.authorHome=   authorInfo.querySelector('a.author-link') && ( authorInfo.querySelector('a.author-link').href )
			itemdata.badge =       authorInfo.querySelector('span.icon-badge') && authorInfo.querySelector('span.icon-badge').dataset.tooltip
			itemdata.badgeSummary= authorInfo.querySelector('span.badge-summary>a') && authorInfo.querySelector('span.badge-summary>a').innerHTML 
			itemdata.bio =         authorInfo.querySelector('span.bio') && authorInfo.querySelector('span.bio').innerHTML 
		}
		if ( content ){
			itemdata.answerDigest = content.querySelector('div.summary').innerHTML.replace(/<[^>]+>/g,"") 
			itemdata.answerUrl =    content.dataset.entryUrl 
			itemdata.publishTime =  content.querySelector('a.text-muted') && content.querySelector('a.text-muted').dataset.tooltip 
			itemdata.updateTime=    content.querySelector('a.text-muted') && content.querySelector('a.text-muted').innerHTML 
		}
		data.push(itemdata);
	}
})

console.log(data.length);
console.log( JSON.stringify(data) );