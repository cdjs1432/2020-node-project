// 3. 함수

// 첫번째 방식
function add(a, b) {
    return a + b;
}

console.log(add(2,3)); // 5

// 두번째 방식 (익명함수)
let add2 = function (a, b) {
    return a + b;
};

console.log(typeof add2);
console.log(add2(2, 3));

// 세번째 방식
let add3 = (function (a, b) {
    return a + b;
})(2, 3);

console.log(typeof add3)
console.log(add3);

// 네번째 방식 (ES6, arrow function)
let add4 = ((a, b) => a + b)(2, 3);

console.log(add4)