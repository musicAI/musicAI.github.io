function btoa(b64encoded){
	return Buffer.from(b64encoded, 'base64');
}
exports.handler = function(evt, context, cb){
	var b = evt.body, q = evt.queryStringParameters;
	if(evt.isBase64Encoded){
		b = btoa(b);
	}
	console.log(q, b);
	cb(null, {
		statusCode: 200,
		body: new Date().toISOString()
	});

}