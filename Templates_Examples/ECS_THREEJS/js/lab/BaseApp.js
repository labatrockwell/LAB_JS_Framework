// LAB BASE
lab.require("lab.EventDispatcher");

lab.BaseApp = function()
{
	lab.self 	= this;
	lab.EventDispatcher.call( this );
}

lab.BaseApp.prototype				= new lab.EventDispatcher();
lab.BaseApp.prototype.constructor 	= lab.BaseApp;
lab.BaseApp.prototype.supr 			= lab.EventDispatcher.prototype;

lab.BaseApp.prototype.begin = function(){
	console.log("base app set up");
	lab.self.setup();
	lab.self.animate();
};

// suggestions for overriding: updating + rendering

lab.BaseApp.prototype.setup 	= function(){};
lab.BaseApp.prototype.preupdate = function(){};
lab.BaseApp.prototype.update	= function(){};
lab.BaseApp.prototype.predraw	= function(){};	// e.g. setup screen
lab.BaseApp.prototype.draw		= function(){};	// override this in your main app
lab.BaseApp.prototype.postdraw 	= function(){}; // e.g. teardown screen

// starts off animation + sets up update/draw loop
lab.BaseApp.prototype.animate	= function(){
	requestAnimationFrame(lab.self.animate);
			
	lab.self.preupdate();
   	lab.self.update();
	lab.self.predraw();
	lab.self.draw();
}

// turn events on + off

lab.BaseApp.prototype.registerMouseEvents = function(){
	window.addEventListener("mousemove", lab.self.onMouseMoved);
	window.addEventListener("mousedown", lab.self.onMouseMoved);
	window.addEventListener("mouseup", lab.self.onMouseMoved);
	window.addEventListener("drag", lab.self.onMouseDragged); // a little hazy on this one
}

lab.BaseApp.prototype.unregisterMouseEvents = function()
{
	window.removeEventListener("mousemove", lab.self.onMouseMoved);
	window.removeEventListener("mousedown", lab.self.onMouseMoved);
	window.removeEventListener("mouseup", lab.self.onMouseMoved);
	window.removeEventListener("drag", lab.self.onMouseDragged);
}

// these could maybe be their jquery equivalents?
// note: these can be used 1 of 2 ways: 
//	1 - overridden: catch the raw event in your app that inherits BaseApp
// 	2 - event dispatchers: add event listeners to any or all of the mouse events!

lab.BaseApp.prototype.onMouseMoved		= function( event )
{
	var mouseObject = {"x":event.clientX, "y":event.clientY}
	lab.self.dispatchEvent("onMouseMoved", mouseObject);
}

lab.BaseApp.prototype.onMousePressed	= function( event )
{
	var mouseObject = {"x":event.clientX, "y":event.clientY}
	lab.self.dispatchEvent("onMousePressed", mouseObject);
}

lab.BaseApp.prototype.onMouseReleased	= function( event )
{
	var mouseObject = {"x":event.clientX, "y":event.clientY}
	lab.self.dispatchEvent("onMouseReleased", mouseObject);
}

lab.BaseApp.prototype.onMouseDragged	= function( event )
{
	var mouseObject = {"x":event.clientX, "y":event.clientY}
	lab.self.dispatchEvent("onMouseDragged", mouseObject);
}