var http = require('http');
var url = require('url');

http.createServer(function (req, res) {

    console.log('Method:', req.method);
    console.log('URL:', req.url);

    var parsed = url.parse(req.url, true);
    console.log(parsed.query.id);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;

    res.write('<h1>Hello, World!</h1>');
    res.write('<h1>안녕!안녕!안녕!</h1>');

    res.end('안...녕....');
}).listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000');
})