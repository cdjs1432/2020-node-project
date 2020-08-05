const PlayerModel = require("../../models/player")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const showSignupPage = (req, res) => {
    res.render("player/signup.ejs");
};

// 회원가입
// - 성공 : 201 응답 (Created), 생성된 player 객체 반환
// - 실패 : 필수 입력값이 누락된 경우 400 (Bad Request)
//          email이 중복된 경우 409 (Conflict)
const signup = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).send("필수값이 입력되지 않았습니다.");
    
    PlayerModel.findOne({ email }, (err, result) => {
        if (err) return res.status(500).send("사용자 조회 시 오류가 발생했습니다.");
        if (result) return res.status(409).send("이미 사용중인 e-mail입니다.");

        // 사용자 정보 등록
        // 단방향 암호화 : 해시
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return res.status(500).send("암호화 시 오류가 발생했습니다.")
            
            const player = new PlayerModel({ name, email, password: hash })
            player.save((err, result) => {
                if (err) return res.status(500).send("사용자 등록 시 오류가 발생했습니다.")

                res.status(201).json(result);
            })
        });
    });
}

const showLoginPage = (req, res) => {
    res.render("player/login.ejs");
}

const showMyPage = (req, res) => {
    res.render("player/mypage.ejs");
}

// 로그인
// - 성공 : email, password가 일치하면 200 리턴
// - 실패 : email, password가 미입력된 경우 400 리턴
//          없는 email인 경우 404 리턴
//          password가 일치하지 않는 경우 500 리턴

const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("필수값이 입력되지 않았습니다.");
    PlayerModel.findOne({ email }, (err, player) => {
        if (err)    return res.status(500).send("로그인 시 오류가 발생했습니다.");
        if (!player)  return res.status(404).send("가입되지 않은 계정입니다.");

        bcrypt.compare(password, player.password, (err, isMatch) => {
            if (err)    return res.status(500).send("로그인 시 오류가 발생했습니다.");
            if (!isMatch)   return res.status(500).send("비밀번호가 올바르지 않습니다.");

            // 비밀번호까지 맞다면 token 발급 (jsonwebtoken)
            const token = jwt.sign(player._id.toHexString(), "secretKey");

            PlayerModel.findByIdAndUpdate(player._id, { token }, (err, result) => {
                if (err)    return res.status(500).send("로그인 시  에러가 발생했습니다.");
                // 토큰 저장 : 쿠키, local storage..
                res.cookie("token", token, { httpOnly: true });
                res.json(result);
            });
        })
    })
}

// 인증 처리
const checkAuth = (req, res, next) => {
    // 공통적으로 사용되는 data
    res.locals.player = null;

    // 쿠키에서 토큰 가져오기
    const token = req.cookies.token;
    if (!token) {
        // 정상적인 경우
        if (req.url === "/" || 
            req.url === "/api/player/signup" ||
            req.url === "/api/player/login")
                return next();
        
        // 비정상적인 경우
        else return res.render("player/login.ejs");
    }

    // token 값을 verify
    jwt.verify(token, "secretKey", (err, _id) => {
        if (err) {
            res.clearCookie("token");
            return res.render("player/login.ejs")
        }

        PlayerModel.findById({ _id, token }, (err, player) => {
            if (err) res.status(500).send("인증 시 오류가 발생했습니다.");
            if (!player) return res.render("player/login.ejs");
            res.locals.player = { name:player.name, role: player.role };
            next();
        })
    })
}

const logout = (req, res) => {
    const token = req.cookies.token;

    jwt.verify(token, "secretKey", (err, _id) => {
        if (err)    return res.status(500).send("로그아웃 시 오류가 발생했습니다.");
        PlayerModel.findByIdAndUpdate(_id, { token: "" }, (err, result) => {
            if (err)    return res.status(500).send("로그아웃 시 오류가 발생했습니다.");
            res.clearCookie("token");
            res.redirect("/");
        })
    })
}

module.exports = { showSignupPage, signup, showLoginPage, login, checkAuth, logout };