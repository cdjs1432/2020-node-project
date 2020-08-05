var game = {
	is_my_turn: Boolean,
	game_started: Boolean,
	game_end: Boolean,
	is_first: Boolean,
	is_player: Boolean,
	field: Array,
	socket: null,
	roomid: String,
		
	init: function(socket){
		var self = this;
		var user_cnt = 0;

		var player_1;
		var player_2;
		
		this.is_my_turn = false;
		this.game_started = false;
		this.game_end = false;
		this.is_first = false;
		this.is_player = true;
		this.roomid = null;

		this.field = Array(15).fill(0).map(() => Array());
		
		socket = io();
		
		socket.on("game_started", (data) => {
			self.game_start();
			self.print_msg(data.username + " 님이 게임을 시작했습니다.");
			$("#start_button").hide();
			$(".blackboard").hide();
			$(".whiteboard").show();
			if (this.is_player) {
				$("#turns").empty()
				$("#turns").append('상대방의 턴입니다.');
				$("#turns").css("color", "red")
			}
		});
		
		socket.on("update_users", function (rooms, gameid, username, x) {
			// If Player Leaves - End game;
			if (!rooms[gameid].start)
				$(".redboard").hide();
			
			if (rooms[gameid].number==1) {
				player_1 = socket.id;
				if (!rooms[gameid].start)
					$(".whiteboard").hide();
			}
			else if (rooms[gameid].number==2 && socket.id != player_1) {
				player_2 = socket.id;
				if (!rooms[gameid].start)
					$(".blackboard").hide();
			}
			else {
				if (player_1 != socket.id && player_2 != socket.id) {
					$("#start_button").hide();
					self.unplayable();
					if (!rooms[gameid].start) {
						$(".blackboard").hide();
						$(".whiteboard").hide();
					}					
				}
			}
			if (username != undefined){
				if (x==0)
					self.print_msg(username + "님이 퇴장하셨습니다.")
				else if (x==1)
					self.print_msg(username + "님이 입장하셨습니다.")
			}
				
			user_cnt = rooms[gameid].number;
			self.update_userlist(socket, gameid);
		});

		//join
		socket.on("connect", () => {
			socket.emit("join", { username: $('#username').val() });
		});

		socket.on("turn_change", () => {
			if (this.is_player) {
				$("#turns").empty()
				$("#turns").append('당신의 턴입니다.');
				$("#turns").css("color", "green")
			}
			self.change_turn();
		});

		socket.on("game_lose", (turn) => {
			self.print_msg("게임이 종료되었습니다.");
			self.lose_game(turn);
		});
		
		$("#start_button").click(function () {
			if(user_cnt == 1){
			   self.print_msg("2명부터 게임이 가능합니다.");
			}
			else{
				socket.emit('game_start', { username: $('#username').val() });
				self.game_start();
				self.make_first();
				self.print_msg("게임을 시작했습니다.");
				$("#start_button").hide();
				$("#turns").empty()
				$("#turns").append('당신의 턴입니다.');
				$("#turns").css("color", "green")
			}
		});

		$(".clickboard").click( function() {
			self.select_stone(this, socket, player_1, player_2);
		});

		$("#submit").click( function() {
			username = $('#username').val();
			msg = $("#sendchatting").val();
			msg = msg.trim();
			if(msg != "") {
				msg = username + ": " + msg
				socket.emit("send_chatting", msg)
				self.chatting(msg);
			}
			$("#sendchatting").val("");
		});

		
		$('#sendchatting').keydown(function(event){ 
			var keyCode = (event.keyCode ? event.keyCode : event.which);   
			if (keyCode == 13) {
				$('#submit').trigger('click');
				event.preventDefault();
			}
		});

		socket.on("stone_change", (x, y, z) => {
			self.change_stone(x, y, z);
		});

		socket.on("explode", (gameid) => {
			self.print_msg("게임이 종료되었습니다.");
			self.explode(gameid);
		});

		socket.on("send_chatting", (msg) => {
			self.chatting(msg);
		});

		socket.on("restore", (gamefield) => {
			$('.whiteboard').hide();
			$('.blackboard').hide();
			for (let i=0; i<15; i++) {
				for (let j=0; j<15; j++) {
					if (gamefield[i][j]) {
						self.change_stone(i, j, gamefield[i][j]);
					}
				}
			}
			$('.redboard').hide();
		})

		
	},
	
	// init 끝
	explode: function(gameid) {
		alert("상대 플레이어와의 연결이 끊겼습니다.")
		this.game_started = false;
		this.game_end = true;
		$("#turns").empty();
		$("#turns").append("게임이 종료되었습니다.");
		$("#turns").css("color", "red");
		$("#start_button").hide();
	},

	unplayable: function() {
		if (this.is_player){
			this.is_player=false;
			alert("이미 두명 이상의 플레이어가 이 방에 있습니다.\n관전 모드로 전환합니다.");
		}
	},

	make_first: function() {
		this.is_first=true;
		this.is_my_turn=true;
		$(".blackboard").show();
		$(".whiteboard").hide();
	},
	
	game_start: function() {
		this.game_started = true;
	},

	change_turn: function () {
		this.is_my_turn = true;
	},

	select_stone: function(obj, socket, player_1, player_2) {
		// 클릭 시 화면에 뿌려주기 구현
		if (this.game_end) {
			alert("이미 종료된 게임입니다.");
		}
		else if (!this.game_started) {
			alert("돌을 두시려면 게임을 시작하세요.")
		}
		else if (!this.is_player) {
			alert("관전 모드입니다. 돌을 둘 수 없습니다.");
		}
		else {
			if (this.is_my_turn) {
				var id = $(obj).attr('id')
				id = id.replace('whiteboard_','');
				id = id.replace('blackboard_','');
				id = id.split("_");
//				console.log(id[0], id[1]);
				x = id[0]
				y = id[1]
				$("#board_" + x + "_" + y).hide();
				$("#whiteboard_"+ x + "_" + y).off('click');
				$("#blackboard_"+ x + "_" + y).off('click');
				if (socket.id == player_1 || socket.id == player_2) {
					if (this.is_first)
						socket.emit("change_stone", x, y, 2);
					else
						socket.emit("change_stone", x, y, 1);
				}
				this.is_my_turn=false;
				$("#turns").empty()
				$("#turns").append('상대방의 턴입니다.');
				$("#turns").css("color", "red")
				socket.emit("change_turn");


				if (this.is_first) {
					this.field[x][y]=1;
				}
				else { 
					this.field[x][y]=2;
				}

				// 클릭 시, 승리 여부 판단
				// 어차피 field는 클라이언트, 1 OR 2만 담김 - emit으로 승리 뿌려주기 하면 됨
				
				// 승리 검사
				let check=false;
				let cnt1=0, cnt2=0, cnt3=0, cnt4=0, cnt5=0, cnt6=0; // 각각 가로, 세로, 오른쪽 아래 (오른부분/왼부분), 오른쪽 위 (오른부분/왼부분)
				for (let i=0; i<15; i++) {
					for (let j=0; j<15; j++) {
						if (this.field[i][j]==undefined) {
							cnt1=0;
						}
						else {
							cnt1++;
						}
						if (this.field[j][i]==undefined) {
							cnt2=0;
						}
						else {
							cnt2++;
						}


						if (i+j<15) {
							if (this.field[i+j][j]==undefined) {
								cnt3=0;
							}
							else {
								cnt3++;
							}

							if (this.field[j][i+j]==undefined) {
								cnt4=0;
							}
							else {
								cnt4++;
							}
						}

						if (14-i-j>=0) {
							if (this.field[j][14-i-j]==undefined) {
								cnt5=0;
							}
							else {
								cnt5++;
							}

							if (this.field[14-i-j][j]==undefined) {
								cnt6=0;
							}
							else {
								cnt6++;
							}
						}

						if (cnt1==5 || cnt2==5 || cnt3==5 || cnt4==5 || cnt5==5 || cnt6==5) {
							check=true;
							break;
						}

					}
					
					if (check==true) {
						break;
					}
					cnt=0;
				}

				// 클라이언트의 승리
				if (check == true) {
					socket.emit("end_game", this.is_my_turn);
				}


			}
			else {
				alert("상대의 턴입니다.");
			}

		}
	},

	lose_game: function(turn) {
		if (!this.is_player)
			alert("게임이 종료되었습니다!")
		else if (this.is_my_turn!=turn)
			alert("패배하셨습니다...");
		else
			alert("축하합니다! 승리하셨습니다!");
		this.game_started=false;
		this.game_end=true;
		$("#turns").empty();
		$("#turns").append("게임이 종료되었습니다.");
		$("#turns").css("color", "red");
	},

	change_stone: function(x, y, z) {
		$("#whiteboard_"+ x + "_" + y).off('click');
		$("#blackboard_"+ x + "_" + y).off('click');
		if (z==1) {
			$("#whiteboard_"+ x + "_" + y).show();
			$("#whiteboard_"+ x + "_" + y).css("opacity", "1");
			$(".redboard").hide();
			$(".redboard").css("opacity", 0);
			$("#red_whiteboard_"+ x + "_" + y).show();
			$("#red_whiteboard_"+ x + "_" + y).css("opacity", "1");
			$("#blackboard_"+x+"_"+y).hide();
		}
		else if (z==2) {
			$(".redboard").hide();
			$(".redboard").css("opacity", 0);
			$("#red_blackboard_"+ x + "_" + y).show();
			$("#red_blackboard_"+ x + "_" + y).css("opacity", "1");
			$("#blackboard_"+x+"_"+y).show();
			$("#blackboard_"+x+"_"+y).css("opacity", "1");
			$("#whiteboard_"+ x + "_" + y).hide();
		}
		$("#board_" + x + "_" + y).hide();
	},
	
	update_userlist: function (this_socket, game_id ) {
		
	},
	
	
	print_msg: function (msg) {
		msg = "SYSTEM: " + msg;
		$("#chatting").append(msg + "<br />" + "\n");
		$('#chatting').scrollTop($('#chatting')[0].scrollHeight);
	},

	chatting: function (msg) {
		$("#chatting").append(msg + "<br />" + "\n");
		$('#chatting').scrollTop($('#chatting')[0].scrollHeight);
	}
};

$(document).ready(function () {
	game.init();
});