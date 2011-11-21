var ClassB = function() {
	"use strict";
	var self = this;
	this.className = "ClassB";
	LAB.EventDispatcher.call(this, this);
	
	var arg = "hi, I\'m an optional arg";
	
	// bind is your friend :)
	// also allows you to pass optional args to a method
	setTimeout(this.dispatch.bind(this, arg), 3000);
	
}

ClassB.prototype = new LAB.EventDispatcher;
ClassB.prototype.constructor = ClassB;

ClassB.prototype.dispatch = function(arg) {
	console.log(arg);
	var params = {secret: "monkey", topSecret: "banana"};
	this.dispatchEvent("timeout", params);
}