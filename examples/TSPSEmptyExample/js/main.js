// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/BaseApp.js");
LAB.require(LAB.src+"app/TSPSApp.js");

var app;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, LAB.app.TSPSApp.prototype, DemoApp.prototype);
	app 	= new DemoApp();
	app.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.BaseApp.call( this );
		LAB.app.TSPSApp.call( this );
		
		//-------------------------------------------------------
		this.setup = function (){
			this.connect(7681);
		}

		//-------------------------------------------------------
		this.update = function (){
		}

		//-------------------------------------------------------
		this.draw = function (){
		}	

		//-------------------------------------------------------
		this.onPersonEntered = function( person ){
		};
	
		//-------------------------------------------------------
		this.onPersonUpdated = function( person ){
			
		};

		//-------------------------------------------------------
		this.onPersonMoved = function( person ){
			
		};
	
		//-------------------------------------------------------
		this.onPersonLeft = function( person ){
			
		};

		//-------------------------------------------------------
		this.onMouseMoved = function( x,y ){
			
		};

		//-------------------------------------------------------
		this.onMousePressed = function( x,y ){
			
		};

		//-------------------------------------------------------
		this.onMouseDragged = function( x,y ){
			
		};

		//-------------------------------------------------------
		this.onMouseReleased = function( x,y ){
			
		};

		//-------------------------------------------------------
		this.onDocumentKeyDown = function( key ){
			
		};
	}
	
