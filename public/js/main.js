(function(){
	var socket = io();
	playerA = jwplayer('playerA');

	//events from server
	socket.on('play', function(){
		if (playerA.getState() != "PLAYING") {
			playerA.play(true);
		}
		console.log('playFromServer');
	});

	socket.on('pause', function(){
		if (playerA.getState() != "PAUSED") {
			playerA.pause(true);
		}
		console.log('pauseFromServer');
	});

	socket.on('seek', function(data){
		playerA.seek(data.offset);
		console.log('seekFromServer');
	});

	//events from player sent to server
	playerA.onPlay(function(oldState){
		socket.emit('play');
		console.log("onPlay");
	});

	playerA.onPause(function(oldState){
		socket.emit('pause');
		console.log("onPause");
	});

	playerA.onSeek(function(offset){
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