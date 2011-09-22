// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src + "app/BaseApp.js");
LAB.require(LAB.src +"agents/Agent.js");
LAB.require(LAB.src +"agents/Group.js");
LAB.require(LAB.src +"agents/Behavior.js");

LAB.require("js/app/cooldivs.js");
LAB.require("js/app/orbit.js");
LAB.require("js/app/scaler.js");


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
		
		// Create a new cooldiv which inherits from an Agent class
		// Add it to a group
		// update and draw the elements in that group
		var divGroup = new LAB.agents.Group();
		var a0 = new Cooldiv("amazingDiv0", 200, 300, 0, 0, 200, 20, true);
		var a1 = new Cooldiv("amazingDiv1", 200, 300, 0, 0, 200, 20, true);
		var a2 = new Cooldiv("amazingDiv2", 200, 300, 0, 0, 200, 20, true);
		var a3 = new Cooldiv("amazingDiv3", 200, 300, 0, 0, 200, 20, true);
		var a4 = new Cooldiv("amazingDiv4", 200, 300, 0, 0, 200, 20, true);
		var a5 = new Cooldiv("amazingDiv5", 200, 300, 0, 0, 200, 20, true);

		// Add Behaviors
		a0.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		a0.addBehavior(new Scaler());
		a1.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		a2.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		a3.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		a4.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		a4.addBehavior(new Scaler());
		a5.addBehavior(new Orbit(500, 400, 100+Math.random()*100, true));
		
		// Add to Group
		divGroup.addToGroup(a0);
		divGroup.addToGroup(a1);
		divGroup.addToGroup(a2);
		divGroup.addToGroup(a3);
		divGroup.addToGroup(a4);
		divGroup.addToGroup(a5);

			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
		}
		
		//update

		this.update = function (){
			divGroup.update();
		}
	
		//draw

		this.draw = function (){
			// do some amazing rustic javascript here
			divGroup.draw();
		}	
	}
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
