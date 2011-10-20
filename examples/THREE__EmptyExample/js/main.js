// load graphics base, because this is a graphics app
LAB.require(LAB.src+"app/ThreeApp.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
	demoApp = new DemoApp();
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================
DemoApp = function() {
	LAB.app.ThreeApp.call( this );		
   
	var _self = this;
   
	var lastMouse = {x:0, y:0};
	var labCam;

	// ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
		// catch mouse events!
		this.registerMouseEvents();
	}
	
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
		
	}
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
		this.renderer.clear();
		
		this.renderer.render( this.scene, this.camera );
	}
	
	// ===========================================
	// ===== RESIZE
	// ===========================================
	this.onWindowResized = function( width, height ) {

	}
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
	this.onMouseMoved = function( x, y ) {
		lastMouse.x = x;
		lastMouse.y = y;
	}
	
	this.onMousePressed	= function( x, y ) {
		LAB.log( circle );
	}
}

	/*
	DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/