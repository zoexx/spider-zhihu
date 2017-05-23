let { log :{ entries } } = require('./www.zhihu.com.har.json');

console.info('get entries length: ' + entries.length );

let cleanEntries = entries.filter(function(value){
	return value.request && value.request.method === 'GET' && /offset/.test(value.request.url)
}) 

console.info('clean entries length: ' + cleanEntries.length );
