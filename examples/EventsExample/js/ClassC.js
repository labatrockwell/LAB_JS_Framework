var ClassC = function() {
	"use strict";
	var self = this;
	this.className = "ClassC";
	// note no reference to target passed here... this doesn't
	// break anything, you just can't get a reference to the target
	// but any other parameters (including the event type) are available
	// to the handler function
	LAB.EventDispatcher.call(this);
	
	// bind is your friend :)
	setTimeout(this.dispatch.bind(this), 4000);
	
}

ClassC.prototype = new LAB.EventDispatcher;
ClassC.prototype.constructor = ClassB;

ClassC.prototype.dispatch = function() {
	var params = {secret: "monkey", topSecret: "banana"};
	this.dispatchEvent("timeout", params);
}