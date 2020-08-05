const MusicModel = require("../../models/music");
const Mongoose = require("mongoose")

// id 유효성 체크 함수
const checkId = (req, res, next) => {
    const id = req.params.id;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).end();
    }
    next();
};



// 목록조회 (localhost:3000/music?limit=3)
// - 성공 : limit 수만큼 music 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우 (400:Bad Request)
const list = (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    MusicModel.find((err, result) => {
        if (err) return res.status(500).end; // next(err); //throw err;
        // res.json(result);
        res.render("music/list", { result: result });
    }).limit(limit).sort({_id: -1})
};

// 상세조회 (music/:id)
// - 성공 : id에 해당하는 music 객체를 리턴 (200: OK)
// - 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
const detail = (req, res) => {
    const id = req.params.id;
    
    /*
    if (!Mongoose.isValidObjectId(id)) {
        return res.status(400).end();
    }
    */

    
    // 1. findById()
    
    MusicModel.findById(id, (err, result) => {
        if (err) return res.status(500).end();   // throw err; 
        if (!result) return res.status(404).end("Not Found");
        // res.json(result);
        res.render("music/detail", { result }  );
    });
    
    // 2. findOne()
    /*
    MusicModel.findOne( {_id: id}, (err, result) => {
        if (err) return res.status(500).end; // throw err;
        if (!result) return res.status(404).end("Not Found");
        res.json(result);
    })
    */
};

// 등록 (/music)
// - 성공 : 201을 응답, 등록한 music 객체를 리턴 201: Created
// - 실패 : singer, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
    const { singer, title } = req.body;
    if (!singer || !title)return res.status(400).send("필수항목이 입력되지 않았습니다.")

    // 1. Model의 객체인 Document 생성 후 save
    /*
    const music = new MusicModel({ singer, title });
    music.save((err, result) => {
        // if (err) return res.status(500).send("DB ERROR")
        if (err) return res.status(500).end();  // throw err; // app.js:38
        res.status(201).json(result)
    })
    */

    // 2. Model.create()
    MusicModel.create({ singer, title }, (err, result)=>{
        if (err) res.status(500).send("등록 시 오류가 발생했습니다."); // throw err;
        res.status(201).json(result)
    });
};

// 수정 (/music/:id)
// - 성공 : id에 해당하는 music 객체에 데이터를 변경
//          해당 객체를 반환
// - 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
//
const update = (req, res) => {
    const id = req.params.id;
    
    const { singer, title } = req.body
    const result = MusicModel.findByIdAndUpdate(id, { singer, title }, { new: true }, (err, result) =>  {
        if (err) return res.status(500).send("수정 시 오류가 발생했습니다.");  // throw err;
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.json(result);
    });
};

// 삭제 (/music/:id)
// - 성공 : id에 해당하는 객체를 삭제 후 출력
// - 실패 : id가 유효하지 않은 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
const remove = (req, res) => {
    const id = req.params.id;

    const result = MusicModel.findByIdAndDelete(id, (err, result) =>  {
        if (err) return res.status(500).send("삭제 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.json(result);
    });
};


// 등록할 페이지 보여주기 (/music/new)
const showCreatePage = (req, res) => {
    res.render("music/create");
};

const showUpdatePage = (req, res) => {
    const id = req.params.id;

    MusicModel.findById(id, (err, result) => {
        if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.render("music/update", { result });
    })
}

module.exports = { list, detail, create, update, remove, checkId, showCreatePage, showUpdatePage };