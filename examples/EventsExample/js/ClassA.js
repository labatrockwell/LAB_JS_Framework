var ClassA = function() {
	"use strict";
	var self = this;
	this.className = "ClassA";
	LAB.EventDispatcher.call(this, this);
	
	setTimeout(dispatch, 2000);

	function dispatch() {
		// also demonstrates ability to override the target property
		var params = {secret: "chicken", superTopSecret: "melon", target: self};
		self.dispatchEvent(new LAB.Event("timeout"), params);
	}
}

ClassA.prototype = new LAB.EventDispatcher;
ClassA.prototype.constructor = ClassA;