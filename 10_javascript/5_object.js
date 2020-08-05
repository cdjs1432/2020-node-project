// 4. 객체

// 객체 선언
let a = {};     // 배열은 [], 객체는 {}
let b = new Object();
console.log(typeof a);

// 객체 : 속성(property), 메소드(method)
let Person = {};
Person.age = 19;
Person["name"] = "효연이";
console.log(Person)

// key: value
let Person2 = {
    age: 10,
    name: "펭수"
};
console.log(Person2.age);
console.log(Person2["name"]);

Person2.add = function() {
    console.log("저는 %d살 %s입니다.", this.age, this.name);
}

Person2.add();

let Person3 = {
    age: 10,
    name: "펭수",
    print: function() {
        console.log("저는 %d살 %s입니다.", this.age, this.name);
    }
};

Person3.print();

// 배열 Friends안에 두 개 객체를 생성
// 객체 property : no, name
let Friends = [{no: 12, name: "신채훈"}, {no: 26, name: "정민욱"}];
console.log(Friends)

// 훈채 출력
console.log(Friends[0].name);
// 미눅스 출력
console.log(Friends[1]["name"]);

let grades = {
    data: {
        kor: 100, mat: 90, eng: 95
    },
    print: function() {
        for(subject in this.data) {
            console.log(subject + " : " + this.data[subject])
        };
    }
};

grades.print();

// 수학 점수 출력
console.log(grades.data.mat);
console.log(grades.data["mat"]);
console.log(grades["data"].mat);
console.log(grades["data"]["mat"]);

let id = 3404
let name = "김도훈"

let obj = {
    id,
    name
};

console.log()