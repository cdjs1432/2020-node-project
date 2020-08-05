// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');
const LobbyModel = require("./models/lobby");
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const playerCtrl = require("./api/player/player.ctrl")
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Database connected!!")
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(playerCtrl.checkAuth);


app.get("/", (req, res) => {
	res.render("main.ejs");
})

app.use("/api", require("./api"));


var gameid = null;

app.get('/api/lobby/:id', (req, res) => {  
	gameid = req.params.id;
	LobbyModel.findById(gameid, (err, result) => {
		console.log(result)
        if (err)
			console.log("ERROR")
		else if (!result)
			console.log("NOT FOUND");
		if (err || !result) {
			const limit = parseInt(req.query.limit || 10, 10);
			if (Number.isNaN(limit)) {
				return res.status(400).end();
			}
			LobbyModel.find((err, result) => {
				if (err) return res.status(500).end;
				res.render("lobby/lobby.ejs", { result: result, alert: true });
			}).limit(limit).sort({_id: -1})
		}
		else {
			res.render('game.pug', { title: '오목 게임', gameid: req.params.id });
		}

    });
});

var rooms = {};


io.on('connection', function(socket){ 
	if (!socket.gameid)
		socket.gameid=gameid;

	socket.join(socket.gameid);
	console.log('user connected : ', socket.id, socket.gameid);
	
	socket.on('join', function (data) {
		var username = data.username;
		socket.username = username;
		
		if (!rooms[socket.gameid]) {
			rooms[socket.gameid] = {};
		}
		if (!rooms[socket.gameid].number) {
			rooms[socket.gameid].number = 1;
		} else {
			rooms[socket.gameid].number++;
		}
		if (rooms[socket.gameid].number<=2) {
			socket.isplayer = true;
		} else {
			socket.isplayer = false;
		}

		if (!rooms[socket.gameid].field) {
			rooms[socket.gameid].field = Array(13).fill(0).map(() => Array());
		}
		if (!rooms[socket.gameid].creator) {
			rooms[socket.gameid].creator = username
		}

		console.log(rooms[socket.gameid].number);

		console.log(socket.gameid)
		io.to(socket.gameid).emit('update_users', rooms, socket.gameid, socket.username, 1);

		if (rooms[socket.gameid].start) {
			socket.emit("restore", rooms[socket.gameid].field)
		}
	});
	
	socket.on('game_start', function (data) {
		rooms[socket.gameid].start=true
		LobbyModel.findById(gameid, (err, result) => {
			var title = result.title;
			var creator = result.creator;
			title = title + "  (플레이중)"
			if (err)
				console.log("ERROR")
			else if (!result)
				console.log("NOT FOUND");
			else {
				LobbyModel.findByIdAndUpdate(socket.gameid, { title, creator }, { new: true }, (err, result) =>  {
					if (err) return res.status(500).send("수정 시 오류가 발생했습니다.");  // throw err;
					if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
				});
			}
		})
		socket.to(socket.gameid).emit("game_started", data);
		io.to(socket.gameid).emit('update_users', rooms, socket.gameid, 2);
	});

	socket.on("change_stone", (x, y, z) => {
		rooms[socket.gameid].field[x][y]=z;
		io.to(socket.gameid).emit("stone_change", x, y, z);
	})

	socket.on("change_turn", () => {
		socket.to(socket.gameid).emit("turn_change", socket.isplayer);
	})

	socket.on("end_game", function(turn) {
		// if game started - DELETE Lobby DB
		const result = LobbyModel.findByIdAndDelete(socket.gameid, (err, result) =>  {
			console.log("ID: ", socket.gameid)
			if (err) console.log("삭제 시 오류가 발생했습니다.");
			else if (!result) console.log("해당하는 정보가 없습니다.");
		});
		rooms[socket.gameid].end=true
		io.in(socket.gameid).emit("game_lose", turn);
	})

	socket.on("send_chatting", function (msg) {
		socket.to(socket.gameid).emit("send_chatting", msg);
	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected : ', socket.username, socket.gameid);
		// If Player Leaves - Stop the Game
		if (socket.isplayer && !rooms[socket.gameid].end) {
			io.to(socket.gameid).emit('explode', socket.gameid);
			const result = LobbyModel.findByIdAndDelete(socket.gameid, (err, result) =>  {
				console.log("ID: ", socket.gameid)
				if (err) console.log("삭제 시 오류가 발생했습니다.");
				else if (!result) console.log("해당하는 정보가 없습니다.");
			});
		}
		rooms[socket.gameid].number--;
		console.log(rooms[socket.gameid].number);
		io.to(socket.gameid).emit('update_users',rooms, socket.gameid, socket.username, 0);
	});
});

http.listen(3000, function(){ 
	console.log('server on!');
});
