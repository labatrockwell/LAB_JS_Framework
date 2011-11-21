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

		//cameras
        labCam = new LAB.three.Camera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
        labCam.setToWindowPerspective();

		ambientLight = new THREE.AmbientLight( 0xFFFFFF );

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
		// should this auto-render? <--- LB: I think this needs to stay here so that we can draw multiple objects with multiple scenes
		this.renderer.render( this.scene, labCam );
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