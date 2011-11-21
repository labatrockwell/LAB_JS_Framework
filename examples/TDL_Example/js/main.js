// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/TDLApp.js");

// include custom class
LAB.require("js/Rectangle.js");
LAB.require("js/Line.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.TDLApp.prototype, DemoApp.prototype);

	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.TDLApp.call( this );		
		
		var _self = this;
	
		// webgl vars		
		var shapeShader, texShader;
		var rectMesh;
		var line;
		var lastMouse = {x:0, y:0};
			
	// SETUP
		
		this.setup = function (){
			shapeShader = new LAB.tdl.Shader();
			shapeShader.setup( 'shapeShader-vs', 'shapeShader-fs');
		
			rectMesh 		= new Rectangle(shapeShader); // see below
			line			= new Line(shapeShader);
			// catch mouse events!
			this.registerMouseEvents();
		}
		
	// UPDATE

		this.update = function (){			
			rectMesh.width = rectMesh.height = (Math.abs(this.mouse.x - lastMouse.x)/10.+1)*100;
			rectMesh.x = this.mouse.x - rectMesh.width/2;
			rectMesh.y = this.mouse.y - rectMesh.height/2;
			
			line.addPoint( this.mouse.x, this.mouse.y );
						
			lastMouse.x = this.mouse.x;
			lastMouse.y = this.mouse.y;
			rectMesh.update();
			line.update();
		}

	// DRAW
	
		this.draw = function (){
			line.draw();
			//rectMesh.draw();
		}	
	}
	
