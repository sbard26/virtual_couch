(function(){
	var socket = io();
	playerA = jwplayer('playerA');
	var duration = playerA.getDuration();

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
	});

	$('#play').click(function() {
		socket.emit('play');
	});

	$('#pause').click(function() {
		socket.emit('pause');
	});

 	$( "#slider" ).slider({ 
 		step: .1,
 		stop: function(event, ui) {
 			socket.emit('seek', ui.value);
 			console.log('seekSent' + ui.value);
 		}
 	});

 	var onTimeCalls = 0;
	playerA.onTime(function(data){
		var current = data.position;
		duration = playerA.getDuration();
		$("#curTime").text(current.toString().toHHMMSS());
		$("#totTime").text(duration.toString().toHHMMSS());
		if (onTimeCalls == 5) {
			$( "#slider" ).slider( "option", "max", duration );
			$('#slider').slider("option", "value", current);
			onTimeCalls = 0;
		}
		onTimeCalls++;
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

})(this);