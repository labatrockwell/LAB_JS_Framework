LAB.require("js/lab/EventDispatcher.js");

/** @namespace LAB.utils */
LAB.utils = LAB.utils || {};

/** 
	Creates a new Websocket with host (defaults to "ws://localhost:8888")
	@constructor
	@augments LAB.EventDispatcher
*/

LAB.utils.WebSocket = function( _host, params ) {
	// console.log( params );
	this.host = _host || "ws://localhost:8888";
	this.socket;
}

/**
@function
*/
LAB.utils.WebSocket.prototype.connect = function() {
	try {
		this.socket = new WebSocket( this.host );
		this.socket.parent = this;
		this.socket.onmessage = this._onMessageReceived;
		this.socket.onopen = this._onConnectionOpened;
		this.socket.onclose = this._onConnectionClosed;
	} catch( ex ) {
		console.log( ex );
	}
}

/**
@function
*/
LAB.utils.WebSocket.prototype.sendData = function( data ) {
	console.log( "seding:" + data );
	this.socket.send( data );
}

LAB.utils.WebSocket.prototype._onConnectionOpened = function() { this.parent.onConnectionOpened(); }

/**
Override in your main app, e.g.:
var socket = new LAB.utils.WebSocket;
socket.onConnectionOpened = this.onConnect;
@function
*/
LAB.utils.WebSocket.prototype.onConnectionOpened = function() {};

LAB.utils.WebSocket.prototype._onConnectionClosed = function() { this.parent.onConnectionClosed(); }

/**
Override in your main app
@function
*/
LAB.utils.WebSocket.prototype.onConnectionClosed = function() {};


LAB.utils.WebSocket.prototype._onMessageReceived = function( data ) {
	//do some default stuff
	this.onMessageReceived(data);
}

/**
Override in your main app
@function
*/
LAB.utils.WebSocket.prototype.onMessageReceived = function( data ) {
	console.log(data);
}