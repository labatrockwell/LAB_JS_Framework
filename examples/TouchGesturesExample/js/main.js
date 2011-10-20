// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/BaseApp.js");

var demoApp;

$(document).ready( function() {
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.BaseApp.call( this );		
		
		var amazingDiv = document.getElementById("amazingDiv");
		
		var divX	= 0;
		var divY	= 0;
		
		var gestureHandler;
		
		console.log("starting up");
			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			
			console.log("registering mouse events");
			this.registerMouseEvents();
			
		
			console.log("registering gesture events");			
			gestureHandler = new TouchGestureHandler();
			gestureHandler.register(window);
			
			gestureHandler.addEventListener(TouchEvent.PRESS, onTouchPress);
			gestureHandler.addEventListener(TouchEvent.RELEASE, onTouchRelease);
			gestureHandler.addEventListener(TouchEvent.FLICK, onTouchFlick);
			gestureHandler.addEventListener(TouchEvent.DRAG, onTouchDrag);
			gestureHandler.addEventListener(TouchEvent.TAP, onTouchTap);
			
			console.log("ready");
		}
		
		function onTouchTap(event) {
			console.log("tap x, y = " + event.target.getTouchX() + ", " + event.target.getTouchY());			
		}
		
		function onTouchDrag(event) {
			console.log("drag direction = " + event.target.getDragDirection());
		}
		
		function onTouchFlick(event) {
			//console.log("got flick");
			console.log("flick direction = " + event.target.getFlickDirection());
			console.log("flick distance = " + event.target.getFlickDistance());
			console.log("flick velocity = " + event.target.getFlickVelocity());
		}
		
		function onTouchPress(event) {
			//console.log("touch x = " + event.target.getTouchX());
			//console.log("touch y = " + event.target.getTouchY());
		}
		
		//update

		this.update = function (){
			//divX = divX + (this.mouse.x-divX)/10;
			//divY = divY + (this.mouse.y-divY)/10;
		}
	
		//draw

		this.draw = function (){
			// do some amazing rustic javascript here
			//amazingDiv.style.left = divX-amazingDiv.clientWidth/2+"px";
			//amazingDiv.style.top = divY-amazingDiv.clientHeight/2+"px";
		}	
	}
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
