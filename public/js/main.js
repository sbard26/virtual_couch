(function(){
	var socket = io();
	playerA = jwplayer('playerA');
	var host = false;

	//events from server
	socket.on('play', function(){
		if(playerA.getState() != "PLAYING") {
			playerA.play(true);
			console.log("playFromServer");
		}
	});

	socket.on('pause', function(){
		if (playerA.getState() != "PAUSED") {
			playerA.pause(true);
			console.log("pauseFromServer");
		}
	});

	socket.on('time', function(position) {
		var timeDifference = Math.abs(playerA.getPosition() - position);
		if (timeDifference > 1) {
			playerA.seek(position);
			console.log('timeFromServer' + position);
		}
		console.log('timeFromServer ' + position + " " + playerA.getPosition());
	});

	socket.on('rewind', function(){
		var position = playerA.getPosition(playerA);
		position -= 5;
		playerA.seek(position);
	});


	//events from player sent to server
	playerA.onPlay(function(){
		socket.emit('play');
		console.log("onPlay");
	});

	playerA.onSeek(function(){
		host = true;
		console.log("host change");
	});

	playerA.onPause(function() { 
		socket.emit('pause');
		console.log("onPause");
	});

	$('#play').click(function() {
		socket.emit('play');
	});

	$('#pause').click(function() {
		socket.emit('pause');
	});

	var onTimeCalls = 0;
	playerA.onTime(function(data){
		if (onTimeCalls == 5 && playerA.getState() == "PLAYING" && host) {
			socket.emit('time', data.position);
			console.log('time ' + data.position + ' ' + playerA.getState());
			onTimeCalls = 0;
		} else if (onTimeCalls == 5) {
			onTimeCalls = 0;
		}
		onTimeCalls++;
	});
	
	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});

})(this);