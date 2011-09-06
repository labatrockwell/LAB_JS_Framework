LAB.require("js/lab/EventDispatcher.js");

LAB.utils = LAB.utils || {};

LAB.utils.WebSocket = function( _ip, _port ) {
	this.s = WebSocket();
	
}

LAB.app.utils.prototype.connect = function() {

//connect, on open, on close, on message