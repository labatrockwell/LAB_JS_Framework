function Agent() {

};

Agent.prototype.setup = function(_id, _x, _y, _z, _rotation, _sWidth, _sHeight, _isVisible) {
	this.pos = [];
	this.myID = _id;
	this.groupSize;
	this.rotation = _rotation;
	this.currentWidth = _sWidth;
	this.currentHeight = _sHeight;
	this.isVisible = _isVisible;
	this.startWidth;
	this.startHeight;
	this.xScale = 1;
	this.yScale = 1;
	this.color;
	this.pos['x'] = _x; // = 0; //100;
	this.pos['y'] = _y; // = 0; //100;
	this.pos['z'] = _z; // = 0; //100;
	this.Behaviors = [];
};

Agent.prototype.addBehavior = function(Behavior) {
	this.Behaviors.push(Behavior);
	Behavior.setup(this);
	console.log(this.Behaviors);
};

Agent.prototype.removeBehavior = function(Behavior) {
	// this.Behaviors.push(Behavior);
	// Behavior.setup(this);
	// console.log(this.Behaviors);
};

Agent.prototype.applyBehaviors = function() {
	var i=0;
	for (i=0; i<this.Behaviors.length; i++) {
		this.Behaviors[i].apply(this);
	}
}

Agent.prototype.checkIt = function() {
	console.log("check!");
};