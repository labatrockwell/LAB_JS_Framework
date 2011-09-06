// LAB BASE
LAB.require("js/utils/RequestAnimationFrame.js");
LAB.require("js/lab/EventDispatcher.js");

LAB.BaseApp = function()
{
		
	LAB.self 	= this;
	LAB.EventDispatcher.call( this );
	
	//utils
	this.mouse	= {x:0, y:0, bDown:false};
	this.startTime 		= new Date().getTime();
	this.elapsedTime 	= 0;
}

LAB.BaseApp.prototype				= new LAB.EventDispatcher();
LAB.BaseApp.prototype.constructor 	= LAB.BaseApp;
LAB.BaseApp.prototype.supr 			= LAB.EventDispatcher.prototype;

LAB.BaseApp.prototype.begin = function(){
	console.log("base app set up");
	this.setup();
	this.animate();
};

// suggestions for overriding: updating + rendering

LAB.BaseApp.prototype.setup 	= function(){};
LAB.BaseApp.prototype.preupdate = function(){};
LAB.BaseApp.prototype.update	= function(){};
LAB.BaseApp.prototype.predraw	= function(){};	// e.g. setup screen
LAB.BaseApp.prototype.draw		= function(){};	// override this in your main app
LAB.BaseApp.prototype.postdraw 	= function(){}; // e.g. teardown screen

// starts off animation + sets up update/draw loop
LAB.BaseApp.prototype.animate	= function(time){
	// update time
	LAB.self.elapsedTime = new Date().getTime() - LAB.self.startTime;
	
	requestAnimationFrame(LAB.self.animate, this);
			
	LAB.self.preupdate();
   	LAB.self.update();
	LAB.self.predraw();
	LAB.self.draw();
	LAB.self.postdraw();
}

// ===========================================
// ===== MOUSE
// ===========================================

	// turn events on + off

	LAB.BaseApp.prototype.registerMouseEvents = function(){
		window.addEventListener("mousemove", LAB.self.onMouseMoved);
		window.addEventListener("mousedown", LAB.self.onMouseMoved);
		window.addEventListener("mouseup", LAB.self.onMouseMoved);
	}

	LAB.BaseApp.prototype.unregisterMouseEvents = function()
	{
		window.removeEventListener("mousemove", LAB.self.onMouseMoved);
		window.removeEventListener("mousedown", LAB.self.onMouseMoved);
		window.removeEventListener("mouseup", LAB.self.onMouseMoved);
	}

	// these could maybe be their jquery equivalents?
	// note: these can be used 1 of 2 ways: 
	//	1 - overridden: catch the raw event in your app that inherits BaseApp
	// 	2 - event dispatchers: add event listeners to any or all of the mouse events!

	LAB.BaseApp.prototype.onMouseMoved		= function( event )
	{	 
		// if the mouse is down, call dragged instead of moved
		if (LAB.self.mouse.bDown){
			LAB.self.onMouseDragged(event);
			return;
		}
		LAB.self.mouse.x = event.clientX; 
		LAB.self.mouse.y = event.clientY;
		LAB.self.dispatchEvent("onMouseMoved", LAB.self.mouse);
	}

	LAB.BaseApp.prototype.onMousePressed	= function( event )
	{
		LAB.self.mouse.x = event.clientX; 
		LAB.self.mouse.y = event.clientY;
		LAB.self.mouse.bDown = true;
		LAB.self.dispatchEvent("onMousePressed", LAB.self.mouse);
	}

	LAB.BaseApp.prototype.onMouseReleased	= function( event )
	{
		LAB.self.mouse.x = event.clientX; 
		LAB.self.mouse.y = event.clientY;
		LAB.self.mouse.bDown = false;
		LAB.self.dispatchEvent("onMouseReleased", LAB.self.mouse);
	}

	LAB.BaseApp.prototype.onMouseDragged	= function( event )
	{
		LAB.self.mouse.x = event.clientX; 
		LAB.self.mouse.y = event.clientY;
		LAB.self.dispatchEvent("onMouseDragged", LAB.self.mouse);
	}
	
// ===========================================
// ===== TIME
// ===========================================

	LAB.BaseApp.prototype.getElapsedTimeMillis	= function()
	{
		return LAB.self.elapsedTime;
	}
	
	LAB.BaseApp.prototype.getElapsedTimeSeconds	= function()
	{
		return LAB.self.elapsedTime/1000;
	}
