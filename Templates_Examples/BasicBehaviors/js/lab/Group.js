function Group() {
	this.Agents = [];
}

Group.prototype.addToGroup = function(Agent) {
	// console.log("Added to Group" + Agent);
	console.log(this.Agents);
	this.Agents.push(Agent);
}

Group.prototype.update = function() {
	var i = 0;
	for (i=0; i<this.Agents.length; i++) {
		this.Agents[i].update();
		this.Agents[i].applyBehaviors();
	}
}

Group.prototype.draw = function() {
	var i = 0;
	for (i=0; i<this.Agents.length; i++) {
		this.Agents[i].draw();
	}
}

var thing = $.extend(true, Group.prototype, Agent.prototype); // How should we fix this?