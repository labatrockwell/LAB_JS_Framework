// load graphics base, because this is a graphics app
// ...this doesn't really work yet
// it might work now...

LAB.require(LAB.src+"app/BaseApp.js");

// INCLUDE THE WEBSOCKET STUFF
LAB.require(LAB.src+"utils/WebSocket.js");

var demoApp;

$(document).ready( function() {
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function() {
		LAB.app.BaseApp.call( this );		
		
		/**/
		/* START EXAMPLE */
		/**/
		this.s = new LAB.utils.WebSocket( "ws://localhost:7682", {} );

		this.s.onMessageReceived = myReceiveFunction;
		this.s.onConnectionOpened = myOpenFunction;
		this.s.onConnectionClosed = myCloseFunction;
				
		function myOpenFunction() {
			//you've now connected to the websocket! yay.
			console.log("awesome...");
			this.s.sendData("helo");
		}
		
		function myCloseFunction() {
			//you've now disconnected from the websocket! boooo.
			console.log("awe...");
		}
		
		function myReceiveFunction( data ) {
			//you've received some data from the websocket! yay.

			console.log( "received: " + data );
		}

		//try and connect
		this.s.connect();

		/**/
		/* END */
		/**/

		var amazingDiv = document.getElementById("amazingDiv");

		var divX	= 0;
		var divY	= 0;

		//setup
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
		}
		
		//update

		this.update = function (){
			divX = divX + (this.mouse.x-divX)/10;
			divY = divY + (this.mouse.y-divY)/10;
		}
	
		//draw

		this.draw = function (){
			// do some amazing rustic javascript here
			amazingDiv.style.left = divX-amazingDiv.clientWidth/2+"px";
			amazingDiv.style.top = divY-amazingDiv.clientHeight/2+"px";
		}
	}
	
	
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
