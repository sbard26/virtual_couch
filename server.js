var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
var http = require('http');
var request = ('request');

var pub = __dirname + '/public';
var view = __dirname + '/views';
var times = [];

app.use(express.static(pub));
app.use(express.static(view));

var users = new Object();
var partners = new Object();

io.on('connection', function(socket){
	console.log('connected');

	socket.on('disconnect', function() {
		console.log('disconnect');
		socket.leave(socket.room);
	});

	socket.on('addUser', function(username){
		room = socket.id;
		users[username] = room;
		console.log('User Added: ' + username + "in " + room);
	});

	socket.on('match', function(partnerName){
		partners[socket.id] = users[partnerName];
		socket.emit('redirect');
	});

	socket.on('chat', function(msg){
		console.log(msg);
	});

	socket.on('play', function(){
		io.sockets.socket(socket.id).emit('play');
		io.sockets.socket(partners[socket.id]).emit('play');
	});

	socket.on('pause', function(){
		io.sockets.socket(socket.id).emit('pause');
		io.sockets.socket(partners[socket.id]).emit('pause');
	});

	socket.on('rewind', function(){
		io.sockets.socket(socket.id).emit('rewind');
		io.sockets.socket(partners[socket.id]).emit('rewind');
	});

	socket.on('skip', function(){
		io.sockets.socket(socket.id).emit('skip');
		io.sockets.socket(partners[socket.id]).emit('skip');
	});

	socket.on('seek', function(data){
		io.sockets.socket(socket.id).emit('seek', data);
		io.sockets.socket(partners[socket.id]).emit('seek', data);
	});
    

	// socket.on('play', function(){
	// 	socket.broadcast.to(socket.room).emit('play');
	// });

	// socket.on('pause', function(){
	// 	socket.broadcast.to(socket.room).emit('pause');
	// });

	// socket.on('time', function(data){
	// 	times.push(data);
	// 	if (data < times[times.length-1]){
	// 	socket.broadcast.to(socket.room).emit('time', data);
	// 	}
	// 	else if (data - times[times.length-1] > 5){
	// 		socket.broadcast.to(socket.room).emit('time', data);
	// 	}
	// });


	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});
});

