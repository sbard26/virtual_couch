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

	socket.on('skip', function(){
		var position = playerA.getPosition(playerA);
		position += 5;
		playerA.seek(position);
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

	$('#skip').click(function() {
		socket.emit('skip');
	});

	$('#rewind').click(function() {
		socket.emit('rewind');
	});
	
	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});


})(this);