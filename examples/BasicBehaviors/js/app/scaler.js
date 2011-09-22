function Scaler() {
	this.enlarge = false;
}

Scaler.prototype.setup = function(Agent) {
	console.log("set up scaling");

}

Scaler.prototype.apply = function(Agent) {
	
    this.currentXScale = Agent.xScale;
    this.currentYScale = Agent.yScale;
    
    if (this.currentXScale > 2.0 || this.currentXScale < 0.5)
      this.enlarge = !this.enlarge;
    
    if (this.enlarge) {
      Agent.xScale = this.currentXScale+0.1;
    } else {
      Agent.xScale = this.currentXScale-0.1;
    }	
}




var behave = $.extend(true, Orbit.prototype, Behavior.prototype);