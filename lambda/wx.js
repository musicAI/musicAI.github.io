'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./lib/app')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
function btoa(b64encoded){
	return Buffer.from(b64encoded, 'base64');
}

exports.handler = (event, context, cb) => awsServerlessExpress.proxy(server, (
	function(){
		if(event.isBase64Encoded){
			//console.log('base64 encoded', b);
			event.body = btoa(event.body).toString('utf8'); 
			// for GET request or POST without data, this would be '[object Object]'
		}
		return event;
	}
)(), (
	function(){
		context.succeed = function(results){
			cb(null, results);
		}
		return context;
	}
)());
