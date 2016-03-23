$(document).ready(function() {
			
	var wakeupNow = false;
	var socket = io();
	var clockID = 0;
	
	
	socket.emit("new clock");
	
	
	function playSound() {
		$('#alarm').trigger("play");				
	}

	
	function snooze(amount) {
	
		amount = (amount) ? amount : 5;
	
		$('#alarm').trigger("pause");
		$('#alarm').prop("currentTime", 0);			

		var wakeupMinute 	= parseInt($('#wakeupMinute').val());
		var wakeupHour 		= parseInt($('#wakeupHour').val());
		
		wakeupHour 		= (isNaN(wakeupHour)) ? 0 : wakeupHour;
		wakeupMinute 	= (isNaN(wakeupMinute)) ? 0 : wakeupMinute;
		
		
		wakeupMinute += amount;
		
		if(wakeupMinute > 59) {
			wakeupMinute = wakeupMinute-60;
			wakeupHour++;
		}
		
		wakeupMinute = (wakeupMinute < 10) ? "0"+wakeupMinute : wakeupMinute;
		wakeupHour = (wakeupHour < 10 || wakeupHour == "") ? "0"+wakeupHour : wakeupHour;
		
		console.log("wakeup hour:");
		console.log(wakeupHour);
		$('#wakeupMinute').val(wakeupMinute);
		$('#wakeupHour').val(wakeupHour);
		
		socket.emit("snooze-clock");
		
		wakeupNow = false;
	}

	function updateClock() {
		
		var date 	= new Date();
		var hour 	= date.getHours();
		var minute 	= date.getMinutes();
		var second = date.getSeconds();
		
		// Check if time to wake up
		if(hour == $('#wakeupHour').val() && minute == $('#wakeupMinute').val() && !wakeupNow) {
			playSound();
			$('#snoozeButton').show();
			wakeupNow = true;
		}
		else if(wakeupNow) {
			socket.emit("clock going off");
		}
		
		hour 	= (hour < 10) ? "0"+hour : hour;
		minute 	= (minute < 10) ? "0"+minute : minute;
		second = (second < 10) ? "0"+second : second;
		
		$('#currentHour').html(hour);
		$('#currentMinute').html(minute);
		$('#currentSecond').html(second);
		
		var clockData = new Object();
		clockData['hour'] = hour;
		clockData['minute'] = minute;
		clockData['second'] = second;
		socket.emit("clock data", clockData);
		
		
		setTimeout(function() { updateClock(); }, 1000);
		
	}
	updateClock();
	
	
	$('#snoozeButton').click(function() {
		snooze();
		$(this).hide();
	});

	$('#wakeupHour').change(function() {
		var wakeupHour = parseInt($(this).val());
		
		if(wakeupHour < 10) {
			$(this).val("0"+wakeupHour);
		}
		
	});
	
	$('#wakeupMinute').change(function() {
		var wakeupMinute = parseInt($(this).val());
		
		if(wakeupMinute < 10) {
			$(this).val("0"+wakeupMinute);
		}
		
	});
	
	
	$('#setWakeupTime').click(function() {
		
		$('#wakeupHour').change();
		$('#wakeupMinute').change();
		var wakeupData 			= new Object();
		wakeupData['hour'] 		= $("#wakeupHour").val();
		wakeupData['minute'] 	= $('#wakeupMinute').val();
		
		$("#wakeupHour").attr("disabled", "disabled");
		$("#wakeupMinute").attr("disabled", "disabled");
		
		$(this).data("alarmset", true);
		
		socket.emit("wakeupTimeSet", wakeupData);
	});

	socket.on("snooze", function(data) {
		$('#snoozeButton').click();
		$('#setWakeupTime').click();
	});
	
	socket.on("getWakeupTime", function() {
		
		var wakeupData = false;
		if($('#setWakeupTime').data("alarmset")) {
			wakeupData = new Object();
			wakeupData['hour'] 		= $("#wakeupHour").val();
			wakeupData['minute'] 	= $('#wakeupMinute').val();
		}
		
		socket.emit("wakeupTimeSet", wakeupData);
		
	});
	
});