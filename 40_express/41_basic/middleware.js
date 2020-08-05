//expressjs.com/ko/guide
// 미들웨어 (middleware)
// Express 어플리케이션 : 뼈대
// 어플리케이션에 필요한 기능을 미들웨어로 추가
const express = require('express')
const moment = require('moment');
const logger = require('morgan')
const app = express()
const port = 3000;

app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:3000');
});

const mw1 = (req, res, next) => {
    console.log("첫번째 미들웨어");
    next();
};

const mw2 = (req, res, next) => {
    console.log("두번째 미들웨어");
    next();
};

// 미들웨어 설정 시 순서 중요
// 1. 애플리케이션 레벨 미들웨어
app.use(mw1);
app.use(mw2);

/*
// 로깅처리하는 미들웨어 함수 정의
const logger = (req, res, next) => {
    // 비구조화 할당 (destructuring)
    const { method, url } = req;    // req.method, req.url
    // const method = req.method;
    // const url = req.url;
    const time = moment().format("YYYY-MM-DD HH:mm:ss:SSS");
    console.log(`${method} - ${url} - ${time}`);
    next();
}
*/

app.use(logger);

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/hello", (req, res) => {
    res.send("다음주 수요일.... 으악!!!!!");
});

// 2. 라우터 레벨 미들웨어

// 3. 기본 제공 미들웨어
app.use(express.static("public"));

// 4. 서드 파티 미들웨어
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// 5. 오류 처리 미들웨어
app.use((err, req, res, _) => {

});