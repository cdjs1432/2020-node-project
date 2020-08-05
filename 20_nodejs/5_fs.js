// 기본모듈
// fs : 파일 시스템을 다루기 위한 모듈
const fs = require("fs");

// 파일 읽기
// 동기식
try {
    const data = fs.readFileSync("hello.txt", "utf8");
    console.log(data);  // 1
} catch(exception) {
    console.error("동기식 Error : " + exception);
}
console.log("동기식 읽기 완료");

// 비동기식
fs.readFile("Hello.txt", "utf8", (err, data) => {
    if (err) {
        console.error("비동기식 Error:" + err);
    } else {
        console.log(data);
    }
});
for (i=0; i<100; i++) {
    console.log("WAAA!!!");
}
console.log("비동기식 읽기 완료");
console.log("진짜루??");
for (i=0; i<100; i++) {
    console.log("WAAAA!!");
}