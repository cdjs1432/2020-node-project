// 비동기식 처리 (콜백함수)
function add2(a, b, callback) {
    let sum = a + b;
    callback(sum);
}

add2(2, 3, print);

//익명함수
add2(2, 3, (result) => console.log(refult));