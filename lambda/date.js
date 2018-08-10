const https = require("https");

function get(url, callback) {
    https.get(url, function (result) {
		var dataQueue = "";    
		result.setEncoding('utf8');
        result.on("data", function (dataBuffer) {
            dataQueue += dataBuffer;
        });
        result.on("end", ()=> {
            callback(dataQueue);
        });
    });
}
function post(host, path, data, callback){
	// TODO: parse from url
	var options = {host:host, port:443, path:path, method:'POST'};
	var req = https.request(options, (res)=>{
		var dataQueue = "";
		res.setEncoding('utf8');
		res.on('data', (dataBuffer)=>{
			dataQueue += dataBuffer;
		});
		res.on('end', ()=>{
			callback(dataQueue);
		});
		
	});
	req.on('error', (err)=>{
		console.log(err.message);
		callback('failed to forward');
	});
	req.write(data);
	req.end();
}
function btoa(b64encoded){
	return Buffer.from(b64encoded, 'base64');
}
exports.handler = function(evt, context, cb){
	var b = evt.body, q = evt.queryStringParameters;
	if(evt.isBase64Encoded){
		//console.log('base64 encoded', b);
		b = btoa(b).toString('utf8'); 
		// for GET request or POST without data, this would be '[object Object]'
	}
	
	console.log(q, b);
	// use POST
	post('musicai.top', '/date', 'a=b', (res)=>{
		console.log('forward success!');
		cb(null, {
			statusCode: 200,
			body: 'now: ' + new Date().toISOString() + '\n' + 
				'result: ' + res + '\n' + 
				'data: ' + b + '\n'
		});
	});

	// use GET
	// get('https://musicai.top/date', (res)=>{
	// 	cb(null, {
	// 		statusCode: 200,
	// 		body: new Date().toISOString() + '\n' + res + '\n' + b
	// 	});
	// });
	

}