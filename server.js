var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
var http = require('http');
var request = ('request');

var pub = __dirname + '/public';
var view = __dirname + '/views';

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

	socket.on('match', function(data){
		if(userList.indexOf(data[0]) > -1)
		{
			socket.join(data[0]);
			socket.emit('match', data[0]);
			var msg = data[1] + " has joined the room.";
			io.sockets.in(partnersName).emit('chat message', msg);
		}
		else
		{
			socket.emit('noMatch');
		}
	});

	socket.on('set', function(data){
		partners[data[0]] = data[1];
		partners[data[1]] = data[0];
	})

	socket.on('chat', function(msg){
		console.log(msg);
	});

	socket.on('play', function(userName){
		io.sockets.in(userName).emit('play');
		if(partners[userName])
		{
			io.sockets.in(partners[userName]).emit('play');
		}
	});

	socket.on('pause', function(userName){
		io.sockets.in(userName).emit('pause');
		if(partners[userName])
		{
			io.sockets.in(partners[userName]).emit('pause');
		}	
	});

	socket.on('seek', function(data){
		io.sockets.in(data[1]).emit('seek', data[0]);
		if(partners[data[1]])
		{
			io.sockets.in(partners[data[1]]).emit('seek', data[0]);
		}
	});
    
	socket.on('chat message', function(data){
		if(partners[data[1]])
		{
			io.sockets.in(partners[data[1]]).emit('chat message', data[0]);
		}
		else
		{
			gio.sockets.in(data[1]).emit('chat message', data[0]);
		}
  	});


});

