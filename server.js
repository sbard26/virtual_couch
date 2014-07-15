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

io.on('connection', function(socket){
	socket.join('room');
  	socket.on('disconnect', function(id){
    	console.log('disconnect' + id);
  	});

	socket.on('chat', function(msg){
		console.log(msg);
	});

	socket.on('play', function(){
		io.emit('play');
	});

	socket.on('pause', function(){
		io.emit('pause');
	});

	socket.on('seek', function(offset){
		socket.broadcast.emit('seek', offset);
	});
});
