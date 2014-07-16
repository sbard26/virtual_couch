(function(){
	var socket = io();
	playerA = jwplayer('playerA');


	//events from server
	socket.on('play', function(){
		playerA.play(true);
	});

	socket.on('pause', function(){
		playerA.pause(true);
	});

	socket.on('time', function(data) {
		var timeDifference = Math.abs(playerA.getPosition() - data.position);
		if (timeDifference > 1) {
			playerA.seek(data.position);
			console.log('timeFromServer' + data.position);
		}
	});

	socket.on('rewind', function(){
		var position = playerA.getPosition(playerA);
		position -= 5;
		playerA.seek(position);
	});


	//events from player sent to server

	$('#play').click(function() {
		socket.emit('play');
	});

	$('#pause').click(function() {
		socket.emit('pause');
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