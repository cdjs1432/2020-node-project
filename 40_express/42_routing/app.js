var express = require('express');
var bodyParser = require('body-parser');
var logger = require("morgan");

var app = express();
app.listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000');
});

// form에 전달되는 바디메시지 처리하는 바디파서 모듈 설정
// true : qs(확장모듈), false : querystring(기본모듈)
//  x-www-form-urlencoded로 들어오는 데이터 파싱
app.use(bodyParser.urlencoded({extended: false}));

// 바디메시지가 JSON일때 바디파서 설정
app.use(bodyParser.json());

app.use(express.static('public'));    // 정적 파일 위치 설정, http는 정적파일임.

// 로깅처리 미들웨어 설정
app.use(logger("dev")); // 인자 4개중 1 dev, short, common, combined

// 라우팅 모듈 설정
app.use("/api", require("./api"));
// == app.use("/", require("./api.index"))
// 순서 1. api.js 2. api/index.js



// 여기까지 내려왔으면 위에서 처리가 되지 않은 것
app.use((req, res, next) => {
    // JAVA 스타일 : throw new Error("없는 페이지입니다.")
    const error = new Error("없는 페이지입니다.")
    error.code = 404;
    next(error);
});

// 오류처리 미들웨어 함수
app.use((err, req, res, next) => {
    // if (err.code) res.status(err.code);
    // else    res.status(500);
    res.status(err.code || 500);
    // if (err.message)    res.send(err.message);
    // else    res.send("Internal Server Error");
    res.send(err.message || "Internal Server Error");
});


// HTTP Method (CRUD)
// - GET : 조회
// - POST : 생성
// - PUT : 갱신
// - DELETE : 삭제

// REST API
// HTTP 요청 시 경로에 자원을 요청 -> 명사 지정
// 예) GET /users, GET /users/{id}
// test.com/users/{id} [GET] : 조회 (목록, 상세)
// test.com/users [POST] : 등록
// test.com/users/{id} [PUT] : 갱신
// test.com/users/{id} [DELETE] : 삭제

// (bad case)
// test.com/users/create
// test.com/users/search
// test.com/users/update
// test.com/users/delete
// 중복된 정보 필요 없다!