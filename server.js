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

var users = {};
var partners = {};

io.on('connection', function(socket){
	console.log('connected');

	socket.on('addUser', function(userName){
		console.log(userName);
		console.log(socket.rooms[0]);
		var room = socket.rooms[0];
		users[userName] = room;
		socket.emit('created');
	});

	socket.on('match', function(partnerName){
		if(users[partnerName] == true){
			socket.join(users[partnerName]);
			socket.emit('match');
		}
		else{
			console.log(users[partnerName]);
			socket.emit('noMatch');
		}
	});

	socket.on('chat', function(msg){
		console.log(msg);
	});

	socket.on('play', function(){
		io.sockets.connected[socket.rooms[0]].emit('play');
		console.log(socket.rooms[0]);
	});

	socket.on('pause', function(){
		io.sockets.connected[socket.rooms[0]].emit('pause');
	});

	socket.on('rewind', function(){
		io.sockets.connected[socket.rooms[0]].emit('rewind');
	});

	socket.on('skip', function(){
		io.sockets.connected[socket.rooms[0]].emit('skip');
	});

	socket.on('seek', function(data){
		io.sockets.connected[socket.rooms[0]].emit('seek', data);
	});
    
	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});


});

