$(document).ready(function() {
				
	var socket = io();
	var data = new Object();
	
	$('#snooze').hide();
	
	$('#snooze').click(function() {
		socket.emit("snooze", data);
		$(this).hide();
	});
	
	socket.on("clock data", function(data) {
		$('#clock').html(data['hour']+":"+data['minute']+":"+data['second']);
	});
	
	socket.on("clock going off", function() {
		$('#snooze').show();
	});
	
	socket.on("snooze-clock", function() {
		$('#snooze').hide();
	});
	
});