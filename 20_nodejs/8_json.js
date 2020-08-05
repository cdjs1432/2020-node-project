const singer = {
    name : "퀸",
    members : ["프레디 머큐리", "브라이언 메이", "존 디콘", "로저 테일러"],
    songs: [
        {
            title: "we are the champions",
            year: 1977,
        },
        {
            title: "Radio Ga Ga",
            year: 1984,
        },
    ],
};

// 로저 테일러 출력
console.log(singer.members[3]);

// Radio Ga Ga 출력
console.log(singer.songs[1].title);

// JSON object -> string (http, tcp/ip)
const str = JSON.stringify(singer);
console.log (str);

// string -> JSON object
console.log(JSON.parse(str));