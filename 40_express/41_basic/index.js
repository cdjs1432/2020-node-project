var express = require('express');
var app = express();

app.listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000');
});


app.get('/hello', function(req, res) {
    res.send('<h1>Hello, PPAKPPAKs');
});

app.get('/', function(req, res) {
    console.log('req.query : ', req.query);
    var title = req.query.title;
    var singer = req.query.singer;

    res.send("query string --> title:" + title + ", singer : " + singer);
});