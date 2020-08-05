const mongoose = require("mongoose");

// 스키마 정의 (사용자 정보)
// 컬렉션에 들어가는 Document의 구조를 정의
// 필드, 타입, 필수여부 지정
const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        minlength: 1,
        unique:true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    playcount: {
        type: Number,
        required: true,
        default: 0,
    },
    wincount: {
        type: Number,
        required: true,
        default: 0,
    },
    role: {
        type: Number,
        default: 0 // 0: 일반사용자, 1: 관리자
    },
    token: {
        type: String,
    }
}); 

// 스키마 -> 모델
// 컬렉션 -> musics
const Player = mongoose.model("player", PlayerSchema)
module.exports = Player;
