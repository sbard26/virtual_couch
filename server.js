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
    	io.emit('chat message', msg);
		io.sockets.in(data[1]).emit('chat message', data[0]);
		if(partners[data[1]])
		{
			io.sockets.in(partners[data[1]]).emit('chat message', data[0]);
		}
  	});


});

