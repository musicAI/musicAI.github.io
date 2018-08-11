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

exports.handler = (event, context, callback) => {
	//console.log(event.queryStringParameters);
	context.callbackWaitsForEmptyEventLoop = false; // fix timeout
	context.succeed = function(results){
		console.log(results.headers);
		results.headers.connection = 'close';// fix timeout
		results.headers["Access-Control-Allow-Origin"] = "*";
		callback(null, results);
		return true;
	}
	if(event.isBase64Encoded){
		//console.log('base64 encoded', b);
		event.body = btoa(event.body).toString('utf8');
		console.log(event.body);
		// for GET request or POST without data, this would be '[object Object]'
	}
	return awsServerlessExpress.proxy(server, event, context);
};
