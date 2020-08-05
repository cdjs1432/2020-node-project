var EventEmitter = require("events").EventEmitter;
var evt = new EventEmitter();   // 이벤트 객체 생성

evt.on("helloNode", function(str) {
  console.log(str);
});

setTimeout(function() {
  evt.emit("helloNode", "Hello, Node.js");
}, 3000);       // 3초 있다가 이벤트 발생