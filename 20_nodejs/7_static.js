// 기본모듈 종합실습
// 127.0.0.1:3000/cat.jpg
// http, path, fs
const http = require('http');
const path = require("path");
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // 127.0.0.1:3000/dog.jpg
  const obj = path.parse(req.url);
  console.log(obj);

  const imageFile = "images" + path.sep + obj.base;

  fs.readFile(imageFile, (err, data) => {
    if (err) {
      res.statusCode=404;
      res.end("Not Found");
      return;
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/jpeg")
      res.end(data);  
    }
  })
  res.statusCode = 200;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});