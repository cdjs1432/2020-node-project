const mongoose = require("mongoose");

// 스키마 정의
// 컬렉션에 들어가는 Document의 구조를 정의
// 필드, 타입, 필수여부 지정
const MusicSchema = new mongoose.Schema({
    singer: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
}); 

// 스키마 -> 모델
// 컬렉션 -> musics
const Music = mongoose.model("music", MusicSchema)
module.exports = Music;
