var demoApp;

$(document).ready( function() {

	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
	demoApp 	= new DemoApp();
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
			
		//setup
			
		this.setup = function (){
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
	
