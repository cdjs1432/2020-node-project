const express = require('express');
const router = express.Router();
const ctrl = require("./lobby.ctrl")
// localhost:3000/api/lobby, get
router.get("/", ctrl.list); // 목록조회 (/lobby)
router.get("/new", ctrl.showCreatePage); // 목록 생성
router.post("/", ctrl.create);


module.exports = router;
