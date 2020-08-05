var http = require('http');
var path = require('path');
var fs = require('fs');

http.createServer(function (req, res) {

    var fname = path.basename(req.url);
    var imageFile = __dirname + path.sep + 'images' + path.sep + fname;

    fs.readFile(imageFile, function(err, data) {
        if (err) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
        }
        res.writeHead(200, {'Content-Type' : 'image/jpeg'});
        res.end(data);
    });


}).listen(3000, function () {
    console.log('Server running at 127.0.0.1:3000');
})