var http = require("http");
var data = {username: "hello", password: "123456"};
data = JSON.stringify(data);
//data = require('querystring').stringify(data);
//http://home.ccoop.cn/home/getFloorGoodsDataBySsIdAndSmId?ssid=4
var opt = {
    host: 'home.ccoop.cn',
    // port: '8080',
    method: 'POST',
    path: '/home/getFloorGoodsDataBySsIdAndSmId?ssid=4',
    headers: {
        "Content-Type": 'application/json',
        "Content-Length": data.length
    }
}

var body = '';
var req = http.request(opt, function (res) {
    console.log("response: " + res.statusCode);
    res.on('data', function (data) {
        body += data;
    }).on('end', function () {
        console.log(body)
    });
}).on('error', function (e) {
    console.log("error: " + e.message);
})
req.write(data);
req.end();