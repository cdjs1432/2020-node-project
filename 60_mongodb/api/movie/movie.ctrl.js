const MovieModel = require("../../models/movie");
const Mongoose = require("mongoose");

const checkId = (req, res, next) => {
    const id = req.params.id;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).end();
    }
    next();
};

// 목록조회 (localhost:3000/movie?limit=3)
// - 성공 : limit 수만큼 movie 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우 (400:Bac Request)
const list = (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    MovieModel.find((err, result) => {
        if (err) return res.status(500).end; // next(err); //throw err;
        // res.json(result);
        res.render("movie/list", { result: result });
    }).limit(limit).sort({_id: -1})
};

// 상세조회 (movie/:id)
// - 성공 : id에 해당하는 movie 객체를 리턴 (200: OK)
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
const detail = (req, res) => {
    id = req.params.id;
    //const result = movie.find(m => m.id === id);
    MovieModel.findById(id, (err, result) => {
        if (err)    return res.status(500).end();
        if (!result)    return res.status(404).end("Not Found");
        res.render("movie/detail", result = { result });
    });
};

// 등록 (/movie)
// - 성공 : id 채번, 201을 응답, 등록한 movie 객체를 리턴 201: Created
// - 실패 : singer, title 값 누락 시
const create = (req, res) => {
    const { title, director, year } = req.body;
    console.log(year)
    if (!title || !director || !year)  return res.status(400).end();
    MovieModel.create({ title, director, year}, (err, result) => {
        console.log(err)
        if (err) return res.status(400).send("오류가 발생했습니다!!!");
        res.status(201).json(result);
    });
};

// 수정 (/movie/:id)
// - 성공 : id에 해당하는 movie 객체에 데이터를 변경
//          해당 객체를 반환
// - 실패 : id가 숫자가 아닐 경우 (400: Bad Request)
//          해당하는 id가 없는 경우 (404: Not Found)
//
const update = (req, res) => {
    const id = req.params.id;

    const { title, director, year } = req.body;
    
    MovieModel.findByIdAndUpdate(id, { title, director, year}, {new: true}, (err, result) => {
        if (err)    return res.status(500).send("으악!");
        if (!result)    return res.status(404).end("Not Found!!");
        res.json(result);
    });
};

// 삭제 (/movie/:id)
const remove = (req, res) => {
    id = req.params.id;

    MovieModel.findByIdAndDelete(id, (err, result) => {
        if (err)    return res.status(500).send("삭제에 오류가 발생했습니다.");
        if (!result)    return res.status(404).end("Not Found!!!!");
        res.json(result);
    });
};

const showCreatePage = (req, res) => {
    res.render("movie/create")
}

const showUpdatePage = (req, res) => {
    const id = req.params.id;

    MovieModel.findById(id, (err, result) => {
        if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.render("movie/update", { result });
    })
}

module.exports = { list, detail, create, update, remove, checkId, showCreatePage, showUpdatePage };