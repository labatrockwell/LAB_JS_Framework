// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/TDLApp.js");
LAB.require("js/utils/utils.js");

// include custom class
LAB.require("js/Rectangle.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.TDLApp.prototype, DemoApp.prototype);

	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.TDLApp.call( this );		
		
		var _self = this;
	
		// webgl vars		
		var shapeShader, texShader;
		var rectMesh;
		var lastMouse = {x:0, y:0};
			
	// SETUP
		
		this.setup = function (){
			shapeShader = new LabShader();
			shapeShader.setup( 'shapeShader-vs', 'shapeShader-fs');
			
			rectMesh 		= new Rectangle(shapeShader); // see below

			// catch mouse events!
			this.registerMouseEvents();
		}
		
	// UPDATE

		this.update = function (){			
			rectMesh.width = rectMesh.height = (Math.abs(LAB.self.mouse.x - lastMouse.x)/10.+1)*100;
			rectMesh.x = LAB.self.mouse.x - rectMesh.width/2;
			rectMesh.y = LAB.self.mouse.y - rectMesh.height/2;
			lastMouse.x = LAB.self.mouse.x;
			lastMouse.y = LAB.self.mouse.x;
			rectMesh.update();
		}

	// DRAW
	
		this.draw = function (){
			rectMesh.draw();
		}	
	}
	