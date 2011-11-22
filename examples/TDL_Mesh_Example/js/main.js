// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/TDLApp.js");

// include custom class
LAB.require("js/Rectangle.js");
LAB.require("js/Line.js");
LAB.require( LAB.src+"tdl/LabVbo.js" );

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
		var shapeShader;
      var frameCount = 0;
		var lastMouse = {x:0, y:0};
      
      var vbo;
      var randPos = [];
      var randCol = [];
			
	// SETUP
		
		this.setup = function (){
			shapeShader = new LAB.tdl.Shader();
			shapeShader.setup( 'shapeShader-vs', 'shapeShader-fs');
         
         var p = {x: 0, y: 0, z: 0 };
         for(var i=0; i<8000; i++){
            if( i%3 == 0 ){
               p.x = LAB.random( window.innerWidth * .1, window.innerWidth * .9 );
               p.y = LAB.random( window.innerHeight * .1, window.innerHeight * .9 );
            }
               
            randPos[i*3    ] = LAB.random( -40, 40 ) + p.x;
            randPos[i*3 + 1] = LAB.random( -40, 40 ) + p.y;
            randPos[i*3 + 2] = LAB.random( -40, 40 );
            randCol[i*3    ] = LAB.random( 0.1, 1.1 );
            randCol[i*3 + 1] = LAB.random( 0.1, 1.1 );
            randCol[i*3 + 2] = LAB.random( 0.1, 1.1 );
         }
         
         vbo = new LAB.tdl.LabVbo();
         vbo.addAttribute( { name: "aPosition", data: randPos, size: 3 } );
         vbo.addAttribute( { name: "aColor", data: randCol, size: 3 } );
         
			// catch mouse events!
			this.registerMouseEvents();
		}
		
	// UPDATE

		this.update = function (){			
         frameCount++;
			lastMouse.x = this.mouse.x;
			lastMouse.y = this.mouse.y;
         
         for(var i=0; i<randPos.length; i = i+3){
            randPos[i] += Math.sin( frameCount * .1 + i*.01) * 3;
            randPos[i+1] += Math.cos( frameCount * .1 + i*.01) * 3;
         }
         
         vbo.setAttribute( "aPosition", randPos, 0 );
		}

	// DRAW
      
		this.draw = function (){
         shapeShader.begin();
         vbo.draw( gl.TRIANGLES );
         shapeShader.end();
		}	
	}
	
