(function(){
	var socket = io();
	playerA = jwplayer('playerA');
	var info = {};
	var name = [];
	var duration = playerA.getDuration();
	var isSliding = false;

	//events from server
	socket.on('play', function(){
		playerA.play(true);
	});

	socket.on('pause', function(){
		playerA.pause(true);
	});

	socket.on('seek', function(seekTime) {
		console.log('SeekFromServer');
		playerA.seek(seekTime);
	});

	socket.on('created', function(userName){
		name.push(userName);
		info[userName] = " ";
		$("#created").text("Created! Enjoy!");
	});

	socket.on('match', function(partnerName){
		var userName = name[0];
		info[userName] = partnerName;
		var data = [userName, partnerName];
		socket.emit('set', data);
		$("#match").text("Matched! Enjoy!");
	});

	socket.on('noMatch', function(){
		$("#noMatch").text("No Match");
	});

	$('#play').click(function() {
		var userName = name[0];
		socket.emit('play', userName);
	});

	$('#pause').click(function() {
		var userName = name[0];
		socket.emit('pause', userName);
	});

   	$('#userButton').click(function() {
       var userName = $('#userName').val();
       socket.emit('addUser', userName);
    });

   	$('#partnerButton').click( function() {
       var partnerName = $('#partnerName').val();
       socket.emit('match', partnerName);
    });
 	
 	$( "#slider" ).slider({ 
 		step: .1,
 		stop: function(event, ui) {
 			var seekTime = ui.value;
 			var userName = name[0];
 			var data = [seekTime, userName];
 			console.log('seek send');
 			socket.emit('seek', data);
 			isSliding = false;
 		},
 		start: function(event, ui) {
 			isSliding = true;
 		}
 	});

 	var onTimeCalls = 0;
	playerA.onTime(function(data){
		var current = data.position;
		duration = playerA.getDuration();
		$("#curTime").text(current.toString().toHHMMSS());
		$("#totTime").text(duration.toString().toHHMMSS());
		if (!isSliding) {
			$( "#slider" ).slider( "option", "max", duration );
			$('#slider').slider("option", "value", current);
		}
		onTimeCalls = 0;
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

	$('#emitButton').click(function() {
		var input = $('#message').val();
		console.log(input);
		socket.emit('chat', input);
		$('#message').val('');
		return false;
	});

})(this);