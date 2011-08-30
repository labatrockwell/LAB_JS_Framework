function Orbit(_centerX, _centerY, _rotationRadius, _inMotion) {
	this.name = "orbit";
	this.rotationRadius = _rotationRadius; //100+Math.random()*100;
  	this.centerX = _centerX; //_centerX; //500;
  	this.centerY = _centerY; //500;
  	this.currentAngle = 0;
  	this.angleChange = Math.random()*0.1;
  	this.inMotion = _inMotion; //true;
}

Orbit.prototype.setup = function(Agent) {
	console.log("setup agent: " +Agent);
	Agent.pos['x'] = 500;
	Agent.pos['y'] = 500;
}

Orbit.prototype.apply = function(Agent) {
	Agent.pos['x'] = this.centerX + this.rotationRadius * Math.cos(this.currentAngle);
	Agent.pos['y'] = this.centerY + this.rotationRadius * Math.sin(this.currentAngle);
    
    if (this.inMotion) {
    	this.currentAngle += this.angleChange;
    	this.currentAngle %= 2*Math.PI;
    }
    
}

var behave = $.extend(true, Orbit.prototype, Behavior.prototype);