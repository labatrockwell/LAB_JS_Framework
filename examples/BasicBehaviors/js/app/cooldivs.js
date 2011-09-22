function Cooldiv(_id, _x, _y, _z, _rotation, _sWidth, _sHeight, _isVisible) {
	this.amazingDiv = document.getElementById(_id); //"amazingDiv0"
	this.divX	= 0;
	this.divY	= 0;
	this.offset = Math.random()*10;
	this.setup(_id, _x, _y, _z, _rotation, _sWidth, _sHeight, _isVisible);
}

Cooldiv.prototype.update = function() {
	this.divX = this.pos['x']; //this.offset + this.divX + (LAB.self.mouse.x-this.divX)/10;
	this.divY = this.pos['y']; //this.offset + this.divY + (LAB.self.mouse.y-this.divY)/10;
}

Cooldiv.prototype.draw = function() {
	this.amazingDiv.style.left = this.pos['x']+"px";
	this.amazingDiv.style.top = this.pos['y']+"px";
	// console.log(this.xScale);
	this.amazingDiv.style.width = this.currentWidth * this.xScale+"px";
	this.amazingDiv.style.height = this.currentHeight * this.yScale+"px";
}

Cooldiv.prototype = $.extend(true, Cooldiv.prototype, LAB.agents.Agent.prototype);