// 6. ES6
// var은 함수레벨 스코프
// let은 블럭레벨 스코프
let a = 10;
let b = [1, 2, 3];
let c = {};

const d = 10; // 상수

// 템플릿 문자열 (백틱 `)
let n1 = "펭",
  n2 = "수";
// My name is 펭 수.
let name = "My Name is " + n1 + " " + n2 + ".";
console.log(name);

let name2 = `My name is ${n1} ${n2}.`;
console.log(name2);

function print(a) {
  console.log(a);
}

let f = (a) => {
  console.log(a);
};
f("펭수");

((a) => console.log(a))("펭수");

function add(a, b) {
  return a + b;
}

let addd = (a, b) => {
  return a + b;
};

var result = (function (a, b) {
  return a + b;
})(2, 3);
console.log(result);

console.log(((a, b) => a + b)(2, 3));
