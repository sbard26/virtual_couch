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

var userList = [];
var partners = {};

io.on('connection', function(socket){

	socket.on('addUser', function(userName){
		userList.push(userName);
		socket.join(userName);
		socket.emit('created', userName);
	});

	socket.on('match', function(partnerName){
		if(userList.indexOf(partnerName) > -1)
		{
			socket.join(partnerName);
			socket.emit('match', partnerName);
		}
		else
		{
			socket.emit('noMatch');
		}
	});

	socket.on('set', function(data){
		partners[data.userName] = data.partnerName;
		partners[data.partnerName] = data.userName;
	})

	socket.on('chat', function(msg){
		console.log(msg);
	});

	socket.on('play', function(userName){
		console.log(userName);
		io.sockets.in(userName).emit('play');
		if(partners[userName])
		{
			console.log("play partner");
			io.sockets.in(partners[userName]).emit('play');
		}
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

