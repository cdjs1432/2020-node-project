// 1. 변수
var a = 1;
var b = 2;
c = 3;
console.log(a);
console.log(b);
console.log(c);

var s1 = "Hello";
var s2 = 'world';
console.log(s1, s2);
console.log("%s %s",s1, s2);

console.log(typeof a);
console.log(typeof s1);
console.log(typeof true);
console.log(typeof {});

function foo() {
    console.log(d);
    var d = 10;
    console.log(d);
}

foo();

// ES6(2015) let, const 추가
let e = 10;

// ES5까지는 함수 레벨 스코프
// ES6 : let 추가 -> 블럭 레벨 스코프
function foo2() {
    if (true) {
        // let tmp = 0;
        var tmp = 0;
        console.log("1:", tmp);
    }
    console.log("2:", tmp);
}

foo2()

const v = 10;
v++;