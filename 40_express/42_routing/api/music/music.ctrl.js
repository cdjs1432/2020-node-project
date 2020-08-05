// 데이터
let nextId = 4;
let music = [
    { id : 1, singer: "아이유", title: "에잇" },
    { id : 2, singer: "폴킴", title: "Rain" },
    { id : 3, singer: "장범준", title: "실버판테온" },
];

// 목록조회 (localhost:3000/music?limit=3)
// - 성공 : limit 수만큼 music 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우 (400:Bac Request)
const list = (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    
    // limit수만큼 music객체를 담은 배열 리턴
    res.json(music.slice(0, limit));
};

// 상세조회 (music/:id)
// - 성공 : id에 해당하는 music 객체를 리턴 (200: OK)
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
const detail = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))   return res.status(400).end();

    //const result = music.find(m => m.id === id);
    const result = music.filter((m) => m.id === id)[0];
    if (!result)    return res.status(404).end();
    res.json(result);
};

// 등록 (/music)
// - 성공 : id 채번, 201을 응답, 등록한 music 객체를 리턴 201: Created
// - 실패 : singer, title 값 누락 시
const create = (req, res) => {
    const { singer, title } = req.body;
    if (!singer || !title)  return res.status(400).end();
    const m = { id: nextId++, singer, title };
    music.push(m);
    res.status(201).json(m);
};

// 수정 (/music/:id)
// - 성공 : id에 해당하는 music 객체에 데이터를 변경
//          해당 객체를 반환
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
//
const update = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))   return res.status(400).end();
    const result = music.find(m => m.id === id);
    if (!result)    return res.status(404).end();

    const { singer, title } = req.body;
    if (singer) result.singer = singer;
    if (title) result.title = title;
    res.json(result);
};

// 삭제 (/music/:id)
const remove = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) res.status(400).end();
    
    const result = music.find(m => m.id === id);
    if (!result)    return res.status(404).end();

    music = music.filter(m => m.id!=id)
    res.json(music);
};

module.exports = { list, detail, create, update, remove };
