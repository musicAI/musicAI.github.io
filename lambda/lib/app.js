const wechat = require('./wechat');
const express = require('express');

var config = {
  token: process.env.TOKEN || 'token',
  appid: process.env.APPID || 'appid',
  encodingAESKey: process.env.AESKEY || 'BQoedRxJc03UUzDgbvbo4cMCtn7AebkhJ1hHzYM74am',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

var app = express();
app.use(express.query());
app.use(express.json()); // parse body
app.use(express.urlencoded()); // parse body

var router = wechat(config, function(req, res){
    console.log(req.query, req.body);
    res.end('success!');
});

function dummy(req, res){
    console.log(req.query, req.body);
    res.end('dummy');
}

const _DEBUG_ = true;
app.use(_DEBUG_? dummy: router);

module.exports = app;