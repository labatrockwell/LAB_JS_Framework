// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/TSPSApp.js");

var demoApp;

$(document).ready( function() {	
	
	DemoApp.prototype = $.extend(true, LAB.app.TSPSApp.prototype, DemoApp.prototype);
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.TSPSApp.call( this );	
		console.log("go!");	
				
		this.canvas = null;
		ctx 		= null;
				
		//setup
			
		this.setup = function (){
			
			console.log("setup")
			
			this.canvas = document.getElementById('contourCanvas');
			ctx = this.canvas.getContext('2d');
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			
			this.registerMouseEvents();
			this.connect("7681");
		}
		
		//update

		this.update = function (){
			this.canvas.width = this.canvas.width;
		}
	
		//draw

		this.draw = function (){
			for (var id in this.people){
				var person = this.people[id];

				// draw rect
				ctx.strokeStyle = 'black';
				ctx.strokeRect(person.boundingrect.x*this.canvas.width,person.boundingrect.y*this.canvas.height, person.boundingrect.x*this.canvas.width+person.boundingrect.width*this.canvas.width, person.boundingrect.y*this.canvas.height+person.boundingrect.height*this.canvas.height);
				ctx.stroke();

				// draw contours
				ctx.strokeStyle = '#ff0000';
				ctx.beginPath();
				ctx.moveTo(person.contours[0].x*this.canvas.width,person.contours[0].y*this.canvas.height);

				for (var j=1; j<person.contours.length; j++ ){
					ctx.lineTo( person.contours[j].x*this.canvas.width,person.contours[j].y*this.canvas.height );
				}				
				ctx.stroke();
			}
		}	
	}
