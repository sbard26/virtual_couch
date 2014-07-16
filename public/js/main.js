(function(){
	var socket = io();
	playerA = jwplayer('playerA');


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
	})

	// socket.on('time', function(position) {
	// 	var timeDifference = Math.abs(playerA.getPosition() - position);
	// 	if (timeDifference > 1) {
	// 		playerA.seek(position);
	// 		console.log('timeFromServer' + position);
	// 	}
	// 	console.log('timeFromServer ' + position + " " + playerA.getPosition());
	// });




	//events from player sent to server
	// playerA.onPlay(function(){
	// 	socket.emit('play');
	// 	console.log("onPlay");
	// });

	// playerA.onPause(function() { 
	// 	socket.emit('pause');
	// 	console.log("onPause");
	// });

	// playerA.onSeek(function() {
	// 	socket.emit('seek')
	// })

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

	document.getElementById('seekButton').onclick = function() {
    	var seekTime = parseInt(document.getElementById('seekTime').value);
    	console.log('seekSent' + seekTime)
    	socket.emit('seek', seekTime);
	}

	playerA.onTime(function(data){
		var current = data.position;
		var duration = playerA.getDuration();
		$("#curTime").text(current.toString().toHHMMSS());
		$("#totTime").text(duration.toString().toHHMMSS());
	});

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

	// var onTimeCalls = 0;
	// playerA.onTime(function(data){
	// 	if (onTimeCalls == 10 && playerA.getState() == "PLAYING") {
	// 		socket.emit('time', data.position);
	// 		console.log('time ' + data.position + ' ' + playerA.getState());
	// 		onTimeCalls = 0;
	// 	} else if (onTimeCalls == 10) {
	// 		onTimeCalls = 0;
	// 	}
	// 	onTimeCalls++;
	// });
	
	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});

})(this);