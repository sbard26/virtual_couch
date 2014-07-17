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

	socket.on('rewind', function(){
		var position = playerA.getPosition(playerA);
		position -= 5;
		playerA.seek(position);
	});

	socket.on('skip', function(){
		var position = playerA.getPosition(playerA);
		position += 5;
		playerA.seek(position);
	});

	socket.on('seek', function(seekTime) {
		playerA.seek(seekTime);
	});

	socket.on('created', function(){
		$("#created").text("Created! Enjoy!");
	});

	socket.on('match', function(){
		$("#match").text("Matched! Enjoy!");
	});

	socket.on('noMatch', function(){
		$("#noMatch").text("No Match");
	});

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

	$('#seekButton').click(function() {
       var seekTime = parseInt($('#seekTime').val());
       socket.emit('seek', seekTime);
    });

   	$('#userButton').click(function() {
       var userName = $('#userName').val();
       socket.emit('addUser', userName);
    });

   	$('#partnerButton').click( function() {
       var partnerName = $('#partnerName').val();
       socket.emit('match', partnerName);
    });

   	if(document.URL == "localhost:8080/testServerPage.html"){
		playerA.onTime(function(data){
			var current = data.position;
			var duration = playerA.getDuration();
			$("#curTime").text(current.toString().toHHMMSS());
			$("#totTime").text(duration.toString().toHHMMSS());
		});
	};

	String.prototype.toHHMMSS = function () {
    	var sec_num = parseInt(this, 10); // don't forget the second param
    	var hours   = Math.floor(sec_num / 3600);
    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = "0"+hours;}
    	if (minutes < 10) {minutes = "0"+minutes;}
    	if (seconds < 10) {seconds = "0"+seconds;}
    	var time    = hours+':'+minutes+':'+seconds;
    	return time;
	}

	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});

})(this);