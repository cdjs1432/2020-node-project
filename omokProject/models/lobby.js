const mongoose = require("mongoose");

const LobbySchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
        trim: true
    },
    creator: {
        type: String,
        required: true,
    },
    passwdcheck: {
        type:Boolean,
        required: true,
    },
    passwd: {
        type: String,
    }
});

const Lobby = mongoose.model("lobby", LobbySchema);
module.exports = Lobby;