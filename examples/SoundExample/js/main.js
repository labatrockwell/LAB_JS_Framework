var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);

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