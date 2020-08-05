const express = require('express');
const router = express.Router();
const ctrl = require("./movie.ctrl")
// localhost:3000/movie, get
router.get("/", ctrl.list); // 목록조회 (/movie)
router.get("/:id", ctrl.detail) // 상세조회 (/movie/:id)
router.post("/", ctrl.create); // 등록 (/movie)
router.put("/:id", ctrl.update); // 수정 (/movie/:id)
router.delete("/:id", ctrl.remove); // 삭제 (/movie/:id)

module.exports = router;

