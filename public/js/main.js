(function(){
	var socket = io();

	socket.on('firstShow', function(data) {
		$('body').append(data.data);
	});

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

	jwplayer('playerA').onPlay(function(oldState){
		socket.emit('play');
	});

	jwplayer('playerA').onPause(function(oldState){
		socket.emit('pause');
	});

	jwplayer('playerA').onSeek(function(position, offset){
		socket.emit('seek', {offset: 'offset'});
		console.log('seek');
	});

	

	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});


})(this);