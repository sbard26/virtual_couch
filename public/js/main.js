(function(){
	var socket = io();

	socket.on('firstShow', function(data) {
		$('body').append(data.data);
	});

	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});
})(this);