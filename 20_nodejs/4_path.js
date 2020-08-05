// 기본모듈
// path : 파일/URL 경로를 다루는 모듈
const path = require("path");

console.log(__dirname);
console.log(__filename);

// parse : string -> object
const obj = path.parse(__filename);
console.log(obj);