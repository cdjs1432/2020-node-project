// 데이터
let nextId = 4;
let movie = [
    { id: 1, title: "스타워즈", director: "조지 루카스", year: "1977"},
    { id: 2, title: "아바타", director: "제임스 카메론", year: "2009"},
    { id: 3, title: "인터스텔라", director: "크리스토퍼 놀란", year: "2017"}
];

// 목록조회 (localhost:3000/movie?limit=3)
// - 성공 : limit 수만큼 movie 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우 (400:Bac Request)
const list = (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    
    // limit수만큼 movie객체를 담은 배열 리턴
    res.json(movie.slice(0, limit));
};

// 상세조회 (movie/:id)
// - 성공 : id에 해당하는 movie 객체를 리턴 (200: OK)
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
const detail = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))   return res.status(400).end();

    //const result = movie.find(m => m.id === id);
    const result = movie.filter((m) => m.id === id)[0];
    if (!result)    return res.status(404).end();
    res.json(result);
};

// 등록 (/movie)
// - 성공 : id 채번, 201을 응답, 등록한 movie 객체를 리턴 201: Created
// - 실패 : singer, title 값 누락 시
const create = (req, res) => {
    const { title, director, year } = req.body;
    if (!title || !director || !year)  return res.status(400).end();
    const m = { id: nextId++, title, director, year };
    movie.push(m);
    res.status(201).json(m);
};

// 수정 (/movie/:id)
// - 성공 : id에 해당하는 movie 객체에 데이터를 변경
//          해당 객체를 반환
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
//
const update = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))   return res.status(400).end();
    const result = movie.find(m => m.id === id);
    if (!result)    return res.status(404).end();

    const { title, director, year } = req.body;
    if (title) result.title = title;
    if (director) result.director = director;
    if (year) result.year = year;
    res.json(result);
};

// 삭제 (/movie/:id)
const remove = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) res.status(400).end();
    
    const result = movie.find(m => m.id === id);
    if (!result)    return res.status(404).end();

    movie = movie.filter(m => m.id!=id)
    res.json(movie);
};


module.exports = { list, detail, create, update, remove };
