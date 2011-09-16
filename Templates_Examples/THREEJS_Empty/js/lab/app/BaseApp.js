// LAB BASE
LAB.require("js/utils/RequestAnimationFrame.js");
LAB.require("js/lab/EventDispatcher.js");

/** @namespace LAB.app */

LAB.app = LAB.app || {};

/** 
	Creates a new LAB base app. Extend this in your main app
	or with a new LAB app class
	@constructor
	@augments LAB.EventDispatcher
*/

LAB.app.BaseApp = function() {
	/**
		Globally-accessible app scope
		@type LAB.app.BaseApp
	*/	
	LAB.self 	= this;
	LAB.EventDispatcher.call( this );
	
	/**
		Mouse object: {x:Number, y:Number, bDown:Boolean}
		@type Object
	*/
	this.mouse	= {x:0, y:0, bDown:false};
	
	this.startTime 		= Date.now();
	this.elapsedTime 	= 0;
}

LAB.app.BaseApp.prototype				= new LAB.EventDispatcher();
LAB.app.BaseApp.prototype.constructor 	= LAB.app.BaseApp;
LAB.app.BaseApp.prototype.supr 			= LAB.EventDispatcher.prototype;

/**
Call setup and begin animating
@function
*/

LAB.app.BaseApp.prototype.begin = function(){
	console.log("base app set up");
	this.setup();
	this.animate();
};

// suggestions for overriding: updating + rendering

/**
	override in your main class. called once
	@function
*/
LAB.app.BaseApp.prototype.setup 	= function(){};

/**
	override when extending BaseApp; gets called automatically before update()
	@function
	@private
*/

LAB.app.BaseApp.prototype.preupdate = function(){};

/**
	override in your main class. called once a frame before predraw(), draw(), and postdraw()
	@function
*/

LAB.app.BaseApp.prototype.update	= function(){};

/**
	override when extending BaseApp; gets called automatically before draw().
	useful when setting up an WebGL context, clearing a canvas, etc.
	@function
	@private
*/

LAB.app.BaseApp.prototype.predraw	= function(){};	// e.g. setup screen

/**
	override your main class. called once a frame after update();
	@function
*/

LAB.app.BaseApp.prototype.draw		= function(){};	// override this in your main app

/**
	override when extending BaseApp; gets called automatically after draw().
	useful when tearing down WebGL context, resetting the camera/view, etc
	@function
	@private
*/
LAB.app.BaseApp.prototype.postdraw 	= function(){}; // e.g. teardown screen

/**
	starts off animation + sets up preupdate-update-predraw-draw-postdraw chain
	@function
	@private
*/
LAB.app.BaseApp.prototype.animate	= function(time) {
	// update time
	if (time === undefined){
	} else {
		LAB.self.elapsedTime = time - LAB.self.startTime;
	}
	
	requestAnimationFrame(LAB.self.animate, this);
			
	LAB.self.preupdate();
   	LAB.self.update();
	LAB.self.predraw();
	LAB.self.draw();
	LAB.self.postdraw();
}

// ===========================================
// ===== WINDOW
// ===========================================
LAB.app.BaseApp.prototype.registerWindowResize = function() {
	window.onresize = LAB.self._onWindowResized;
}

LAB.app.BaseApp.prototype._onWindowResized	= function(event) {
	LAB.self.onWindowResized(window.innerWidth, window.innerHeight);
}

LAB.app.BaseApp.prototype.onWindowResized	= function(width, height) {}

// ===========================================
// ===== MOUSE
// ===========================================

/**
	start listening to mouse events
	@function
	@public
*/
LAB.app.BaseApp.prototype.registerMouseEvents = function(){
	window.addEventListener("mousemove", LAB.self._onMouseMoved);
	window.addEventListener("mousedown", LAB.self._onMousePressed);
	window.addEventListener("mouseup", LAB.self._onMouseReleased);
}
/**
	stop listening to mouse events
	@function
	@public
*/
LAB.app.BaseApp.prototype.unregisterMouseEvents = function()
{
	window.removeEventListener("mousemove", LAB.self._onMouseMoved);
	window.removeEventListener("mousedown", LAB.self._onMousePressed);
	window.removeEventListener("mouseup", LAB.self._onMouseReleased);
}

/**
	override in your main app to catch mouse moved events
	@function
	@public
	@param {number} x Mouse x position
	@param {number} y Mouse y position
*/

LAB.app.BaseApp.prototype.onMouseMoved		= function (x,y){};

/**
	override in your main app to catch mouse pressed events
	@function
	@public
	@param {number} x Mouse x position
	@param {number} y Mouse y position
*/
LAB.app.BaseApp.prototype.onMousePressed	= function (x,y){};

/**
	override in your main app to catch mouse pressed events
	@function
	@public
	@param {number} x Mouse x position
	@param {number} y Mouse y position
*/
LAB.app.BaseApp.prototype.onMouseDragged	= function (x,y){};

/**
	override in your main app to catch mouse released events
	@function
	@public
	@param {number} x Mouse x position
	@param {number} y Mouse y position
*/
LAB.app.BaseApp.prototype.onMouseReleased	= function (x,y){};

/**
	called directly by Window. override in your app to directly
	catch the "mousemove" event from Window.
	@function
	@private
	@param {Event} event DOM mouse event
*/

LAB.app.BaseApp.prototype._onMouseMoved		= function( event )
{	 
	// if the mouse is down, call dragged instead of moved
	if (LAB.self.mouse.bDown){
		LAB.self._onMouseDragged(event);
		return;
	}
	LAB.self.mouse.x = event.clientX; 
	LAB.self.mouse.y = event.clientY;
	LAB.self.dispatchEvent("onMouseMoved", LAB.self.mouse);
	LAB.self.onMouseMoved(LAB.self.mouse.x, LAB.self.mouse.y);
}

/**
	called directly by Window. override in your app to directly
	catch the "mousedown" event from Window.
	@function
	@private
	@param {Event} event DOM mouse event
*/

LAB.app.BaseApp.prototype._onMousePressed	= function( event )
{
	LAB.self.mouse.x = event.clientX; 
	LAB.self.mouse.y = event.clientY;
	LAB.self.mouse.bDown = true;
	LAB.self.dispatchEvent("onMousePressed", LAB.self.mouse);
	LAB.self.onMousePressed(LAB.self.mouse.x, LAB.self.mouse.y);
}

/**
	called directly by Window. override in your app to directly
	catch the "mouseup" event from Window.
	@function
	@private
	@param {Event} event DOM mouse event
*/

LAB.app.BaseApp.prototype._onMouseReleased	= function( event )
{
	LAB.self.mouse.x = event.clientX; 
	LAB.self.mouse.y = event.clientY;
	LAB.self.mouse.bDown = false;
	LAB.self.dispatchEvent("onMouseReleased", LAB.self.mouse);
	LAB.self.onMouseReleased(LAB.self.mouse.x, LAB.self.mouse.y);
}

/**
	helper function to call onMouseDragged instead of onMouseMoved.
	overriding this won't help anybody.
	@function
	@private
	@param {Event} event DOM mouse event
*/

LAB.app.BaseApp.prototype._onMouseDragged	= function( event )
{
	LAB.self.mouse.x = event.clientX; 
	LAB.self.mouse.y = event.clientY;
	LAB.self.dispatchEvent("onMouseDragged", LAB.self.mouse);
	LAB.self.onMouseDragged(LAB.self.mouse.x, LAB.self.mouse.y);
}
	
// ===========================================
// ===== TIME
// ===========================================

/**
	get ellapsed time in milliseconds
	@function
	@public
*/

LAB.app.BaseApp.prototype.getElapsedTimeMillis	= function() {
	return LAB.self.elapsedTime;
}

/**
	get ellapsed time in seconds
	@function
	@public
*/

LAB.app.BaseApp.prototype.getElapsedTimeSeconds	= function() {
	return LAB.self.elapsedTime/1000;
}
