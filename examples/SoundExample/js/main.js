// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/BaseApp.js");
LAB.require("js/utils/utils.js");
LAB.require("js/lab/sound/Player.js");

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
		
		var player;
		var div;
		var form;
			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
			div 	= document.getElementById("amazingDiv");
			form	= document.getElementById("controlForm");
			
			player = new LAB.sound.Player(div, false, false);			
			player.loadFile("sounds/tone.mp3");
		}
		
		//update

		this.update = function (){
			player.setLooping(form.elements["loop"].value);
		}
	
		//draw

		this.draw = function (){
		}	
		
		this.onMousePressed = function(x,y){
			player.seekTo(0);
			player.play();
		}
	}
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
