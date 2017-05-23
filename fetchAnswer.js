var page = require('webpage').create(), 
    fs = require("fs"),
    system = require('system');

// 开始的索引 
var start_index = Number(system.args[1]);
// 循环的次数
var times = Number(system.args[2]);

var current_index = start_index ;

const host = 'https://www.zhihu.com'

// page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';


var fullData = fs.read('./afterFormat.json');
fullData = JSON.parse( fullData );
console.log('get full data , items amount -> ' + fullData.length );



function startFetchPageData ( ){
	var currentItem = fullData[current_index];
	if (!currentItem) {
		console.error('can not get index ' + current_index );
		phantom.exit(1);
	}else if ( currentItem.followAmount && currentItem.viewAmount && currentItem.tags ){
		console.log('item data has already fetched , skip...');
		afterFetch();
		return ;
	}
	var url = currentItem.answerUrl ;
	!/www\.zhihu/.test(url) ? url = host + url : null ;
	console.log('start ' + current_index + ' : '+ url);

	page.open(  url , function (status) {
	    if (status !== 'success') {
	        console.log('FAIL to load the address');
	    }else{    	
	    	
		    var answerData = page.evaluate(function () {
		    	var data = {};

		    	var QuestionHeader = document.querySelector('div.QuestionHeader');

		    	if( QuestionHeader ){
				    	// 所属类目
				    	var tagList = [] ;
				    	var tagNodeList = QuestionHeader.querySelectorAll('.QuestionHeader-topics div.Popover>div') ;
				    	for (var i = 0; i < tagNodeList.length; i++) {
				    		tagList.push( tagNodeList[i].innerHTML );
				    	}

				    	
				    	// 关注者
				    	var followAmount = QuestionHeader.querySelector('.QuestionFollowStatus .NumberBoard-item>.NumberBoard-value');
				    	// 被浏览
				    	var viewAmount = QuestionHeader.querySelector('.QuestionFollowStatus div.NumberBoard-item>.NumberBoard-value');
				    	followAmount ? data.followAmount = followAmount.innerHTML : null;
				    	viewAmount   ? data.viewAmount = viewAmount.innerHTML : null;

				    	data.tags = tagList.join(',');

				        return data;

		    	}
		    });
		    
			currentItem['followAmount'] = answerData.followAmount ;
			currentItem['viewAmount'] = answerData.viewAmount ;
			currentItem['tags'] = answerData.tags ;
			console.log('write...');
			fs.write('./afterFormat.json', JSON.stringify(fullData) );
			console.log('done');
			afterFetch();

			return ;
	    }

	})
}



function afterFetch(){
	console.log('finished : ' + current_index );
	current_index += 1 ;
	if ( current_index >= start_index + times ){
		phantom.exit();
	}else{
		// page.close();
		startFetchPageData();
	}
}


startFetchPageData( current_index );

phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};