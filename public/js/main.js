(function(){
	var socket = io();

	//events from server
	socket.on('play', function(){
		jwplayer('playerA').play(true);
		console.log('playFromServer');
	});

	socket.on('pause', function(){
		jwplayer('playerA').pause(true);
		console.log('pauseFromServer');
	});

	socket.on('seek', function(data){
		jwplayer('playerA').seek(data.offset);
		console.log('seekFromServer');
	});

	//events from player sent to server
	jwplayer('playerA').onPlay(function(oldState){
		socket.emit('play');
		console.log("onPlay");
	});

	jwplayer('playerA').onPause(function(oldState){
		socket.emit('pause');
		console.log("onPause");
	});

	jwplayer('playerA').onSeek(function(offset){
		socket.emit('seek', offset);
		console.log('onSeek');
	});

	

	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});


})(this);