var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);

var clockOpened = false;
var clockSocket = null;


io.on("connection", function(socket) {

	socket.on("snooze", function(data) {
		console.log("snooze hit");
		io.emit("snooze", data);
	});
	
	socket.on("new clock", function() {
		clockOpened = true;
		clockSocket = socket;
	});
	
	socket.on("clock data", function(data) {
		io.emit("clock data", data);
	});
	
	socket.on("clock going off", function() {
		io.emit("clock going off");
	});
	
	socket.on("snooze-clock", function() {
		io.emit("snooze-clock");
	});
	
	socket.on("disconnect", function() {
		if(socket == clockSocket) {
			console.log("Clock Closed");
			clockOpened = false;
			clockSocket = null;
		}
	});
	
	
});


app.use("/assets", express.static(__dirname + "/assets"));
app.set("views", "./app/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	
	if(clockOpened) {
		res.redirect("/remote");
		return true;
	}
	
	
	var data = new Object();
	
	data['jsFiles'] = [
		'/assets/js/clock.js'
	];
	
	res.render("index", data);
});

app.get("/remote", function(req, res) {
	
	var data = new Object();
	
	data['jsFiles'] = [
		'/assets/js/remote.js'
	];
	
	res.render("remote", data);
});





http.listen(80, function() {
	console.log("Example app listening on port 80!");
});