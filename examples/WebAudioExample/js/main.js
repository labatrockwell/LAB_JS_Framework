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
		
		var wa_player;
		var pan = new LAB.geom.Point();
			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();			
			
			// Web Audio API element
			wa_player = new LAB.sound.WAPlayer();	
			wa_player.loadFile("sounds/tone.mp3");
		}
		
		//update

		this.update = function (){
			wa_player.setPitch( this.mouse.y - window.innerHeight/2);
		}
	
		//draw

		this.draw = function (){
		}	
		
		this.onMousePressed = function(x,y){
			wa_player.play();
		}
		
		this.onMouseDragged = function(x,y){
			pan.x = (x - window.innerWidth/2)/window.innerWidth/2;
			pan.y  = (y - window.innerHeight/2)/window.innerHeight/2;
			wa_player.setPan( pan.x, pan.y, pan.z );
			wa_player.play();
		}
	}
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
