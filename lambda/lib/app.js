const wechat = require('./wechat');
const fs = require('fs');
const token_file = '/tmp/wx_token';
const express = require('express');
const https = require("https");

var access_token = null;
var time_expire = null;

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

var config = {
    token: process.env.TOKEN || 'token',
    appid: process.env.APPID || 'appid',
    appsecret: process.env.APPSECRET || 'appsecret',
    encodingAESKey: process.env.AESKEY || 'BQoedRxJc03UUzDgbvbo4cMCtn7AebkhJ1hHzYM74am',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
  };

function check_token(){
    
    if(access_token){
        // TODO: check expire
        return true;
    }

    fs.exists(token_file, function(exists){
        if(exists){
            access_token = fs.readFileSync(token_file).toString();
            console.log('restored', access_token);
        }else{
            // refresh_token()
            console.log('refresh')
        }
    })
}

function refresh_token(){
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': config.appid,
        'secret': config.appsecret
      };
    
      let wxGetAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?';// + qs.stringify(queryParams);
      //console.log(wxGetAccessTokenUrl);

      get(url, function(res){
          console.log(res);
          // access_token = res; // need destruct
          // fs.writeFile(token_file, access_token, function (err) {});
      })
}



var app = express();
app.use(express.query());
app.use(express.json()); // parse body
app.use(express.urlencoded()); // parse body

var router = wechat(config, function(req, res){
    //console.log(req.query, req.body);
    var msg = req.weixin || {};
    console.log(msg);
    if(msg.MsgType == 'text'){
        check_token();
    }
    var text = 'welcome! the message you sent is: \n';
    text += JSON.stringify(msg);
    res.reply({type:"text", content: text});
});

function dummy(req, res){
    console.log(req.query, req.body);
    res.end('dummy');
}

const _DEBUG_ = false;
app.use(_DEBUG_? dummy: router);

module.exports = app;