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
			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			
			this.registerMouseEvents();
					
			gestureHandler = new LAB.TouchGestureHandler();
			// register window so we capture all mouse events for entire screen
			gestureHandler.register(window);
			
			// can also register a single DOM object
			//gestureHandler.register("amazingDiv");
			
			gestureHandler.addEventListener(LAB.TouchEvent.PRESS, onTouchPress);
			gestureHandler.addEventListener(LAB.TouchEvent.RELEASE, onTouchRelease);
			gestureHandler.addEventListener(LAB.TouchEvent.FLICK, onTouchFlick);
			gestureHandler.addEventListener(LAB.TouchEvent.DRAG, onTouchDrag);
			gestureHandler.addEventListener(LAB.TouchEvent.TAP, onTouchTap);
		}
		
		function onTouchTap(event) {
			console.log("tap x, y = " + event.target.getTouchX() + ", " + event.target.getTouchY());			
		}
		
		function onTouchDrag(event) {
			console.log("drag direction = " + event.target.getDragDirection());
		}
		
		function onTouchRelease(event) {
		
		}
		
		function onTouchFlick(event) {
			console.log("flick direction = " + event.target.getFlickDirection());
			console.log("flick distance = " + event.target.getFlickDistance());
			console.log("flick velocity = " + event.target.getFlickVelocity());
		}
		
		function onTouchPress(event) {

		}
		
		//update

		this.update = function (){

		}
	
		//draw

		this.draw = function (){

		}	
	}
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
