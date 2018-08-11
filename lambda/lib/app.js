const wechat = require('./wechat');
const fs = require('fs');
const qs = require('query-string');
const token_file = '/tmp/wx_token';
const express = require('express');
const https = require("https");

var access_token = null;
var token_time = null;

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
            //refresh_token()
            console.log('refresh')
        }
    })
}

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}    

function refresh_token(){
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': config.appid,
        'secret': config.appsecret
      };
    
      let wxGetAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(queryParams);
      //console.log(wxGetAccessTokenUrl);

      get(wxGetAccessTokenUrl, function(res){
          res = JSON.parse(res);
          console.log(res);
          access_token = res['access_token']; // need destruct
          fs.writeFile(token_file, access_token, function (err) {
              if(err){
                  console.log(err);
                  token_time = null;
              }else{
                token_time = new Date();
                console.log(token_time.Format('yyyy-MM-dd hh:mm:ss'))
              }
          });
      })
}



var app = express();
app.use(express.query());
app.use(express.json()); // parse body
app.use(express.urlencoded()); // parse body

var router = wechat(config, function(req, res){
    try{
        //console.log(req.query, req.body);
        var msg = req.weixin || {};
        console.log(msg);
        if(msg.MsgType == 'text'){
            check_token();
        }
        var text = 'welcome! the message you sent is: \n';
        text += JSON.stringify(msg);
        res.reply({type:"text", content: text});

    }catch(error){
        console.log(error);
        res.reply({type:"text", content: "Some error occurs!"});
    }
    
});

function dummy(req, res){
    console.log(req.query, req.body);
    res.end('dummy');
}

const _DEBUG_ = false;
app.use(_DEBUG_? dummy: router);

module.exports = app;