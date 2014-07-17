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
		io.sockets.in(data.userName).emit('seek', data.seekTime);
		if(partners[data.userName])
		{
			io.sockets.in(partners[data.userName]).emit('seek', data.seekTime);
		}
	});
    
	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});


});

