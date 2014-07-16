(function(){
	var socket = io();
	playerA = jwplayer('playerA');


	//events from server
	socket.on('play', function(){
		if (playerA.getState() != "PLAYING") {
			playerA.play(true);		
			console.log('playFromServer');
		}
	});

	socket.on('pause', function(){
		if (playerA.getState() != "PAUSED") {
			playerA.pause(true);
			console.log('pauseFromServer');
		}
	});

	socket.on('time', function(data) {
		var timeDifference = Math.abs(playerA.getPosition() - data.position);
		if (timeDifference > 1) {
			playerA.seek(data.position);
			console.log('timeFromServer' + data.position);
		}
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

	var onTimeCalls = 0;
	playerA.onTime(function(data){
		if (onTimeCalls == 15) {
			socket.emit('time', data.position);
			console.log('time' + data.position);
		}
	});
	
	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});


})(this);