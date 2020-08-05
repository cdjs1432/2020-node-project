const LobbyModel = require("../../models/lobby");
const Mongoose = require("mongoose")

// 목록조회 (localhost:3000/music?limit=3)
// - 성공 : limit 수만큼 music 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우 (400:Bad Request)
const list = (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    LobbyModel.find((err, result) => {
        if (err) return res.status(500).end; // next(err); //throw err;
        // res.json(result);
        res.render("lobby/lobby.ejs", { result: result, alert: false});
    }).limit(limit).sort({_id: -1})
};

const showCreatePage = (req, res) => {
    res.render("lobby/create.ejs");
};

const create = (req, res) => {
    creator = res.locals.player.name;
    const { title, passwd, passwdcheck } = req.body;
    if (!title || !creator)return res.status(400).send("필수항목이 입력되지 않았습니다.")
    
    if (passwdcheck) {
        console.log(passwdcheck)
        console.log("Password : " + passwd)
    }
    else{
        console.log("No Password")
    }
    

    LobbyModel.create({ title, creator, passwdcheck, passwd }, (err, result)=>{
        if (err) res.status(500).send("등록 시 오류가 발생했습니다."); // throw err;
        console.log(result)
        res.status(201).json(result)
    });

    console.log("DONE!");
};

const remove = (req, res) => {
    const id = req.params.id;

    const result = LobbyModel.findByIdAndDelete(id, (err, result) =>  {
        if (err) return res.status(500).send("삭제 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.json(result);
    });
};

module.exports = { list, create, showCreatePage, remove};