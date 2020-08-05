const express = require('express');
const router = express.Router();
const ctrl = require("./music.ctrl")
// localhost:3000/music, get
router.get("/", ctrl.list); // 목록조회 (/music)
router.get("/new", ctrl.showCreatePage); // 등록할 페이지 보여주기
router.get("/:id", ctrl.checkId, ctrl.detail) // 상세조회 (/music/:id)
router.get("/:id/update", ctrl.checkId, ctrl.showUpdatePage) // 수정페이지 보여주기
router.post("/", ctrl.create); // 등록 (/music)
router.put("/:id", ctrl.checkId, ctrl.update); // 수정 (/music/:id)
router.delete("/:id", ctrl.checkId, ctrl.remove); // 삭제 (/music/:id)

module.exports = router;
