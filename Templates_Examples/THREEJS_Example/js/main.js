// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/ThreeApp.js");
LAB.require("js/utils/utils.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.ThreeApp.prototype, DemoApp.prototype);
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.ThreeApp.call( this );		
		
		var _self = this;
	
		// webgl vars
		
		var radius	= 5;
		var thetaX	= 0;
		var thetaY	= 0;
		var thetaZ	= 0;
		
		var lastMouse = {x:0, y:0};
			
	// ===========================================
	// ===== SETUP
	// ===========================================
		
		this.setup = function (){
			setupLights();
			generateSquares();

			// catch mouse events!
			this.registerMouseEvents();
		}
	
	// ===========================================
	// ===== THREE.JS: Setup scene
	// ===========================================
		
		function setupLights()
		{
			// add some lights			
			var light = new THREE.DirectionalLight( 0xffffff, 2 );
			light.position.x = 1;
			light.position.y = 1;
			light.position.z = 1;
			light.position.normalize();
			LAB.self.scene.addLight( light );

			var light = new THREE.DirectionalLight( 0xffffff );
			light.position.x = - 1;
			light.position.y = - 1;
			light.position.z = - 1;
			light.position.normalize();
			LAB.self.scene.addLight( light );
		}
		
		function generateSquares(){
			// add some random squares

			var geometry = new THREE.CubeGeometry( 20, 20, 20 );

			for ( var i = 0; i < 500; i ++ ) {

				var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
				object.position.x = Math.random() * 800 - 400;
				object.position.y = Math.random() * 800 - 400;
				object.position.z = Math.random() * 800 - 400;
				object.rotation.x = ( Math.random() * 360 ) * Math.PI / 180;
				object.rotation.y = ( Math.random() * 360 ) * Math.PI / 180;
				object.rotation.z = ( Math.random() * 360 ) * Math.PI / 180;
				object.scale.x = Math.random() * 2 + 1;
				object.scale.y = Math.random() * 2 + 1;
				object.scale.z = Math.random() * 2 + 1;
				LAB.self.scene.addObject( object );
			}
		}
		
	// ===========================================
	// ===== UPDATE
	// ===========================================

		this.update = function (){}
	
	// ===========================================
	// ===== DRAW
	// ===========================================

		this.draw = function (){
			// rotate + render

			radius = 2;
			thetaZ += 0.2;
			this.camera.position.x = radius * ( thetaX * Math.PI / 360 );
			this.camera.position.y = radius * ( thetaY * Math.PI / 360 );
			this.camera.position.z = radius * ( thetaZ * Math.PI / 360 );

			this.camera.update();
			
			// should this auto-render?
			this.renderer.render( this.scene, this.camera );
		}
		
	// ===========================================
	// ===== MOUSE
	// ===========================================

		this.onMouseMoved		= function( event )
		{
			thetaX += (lastMouse.x - event.clientX)/4;
			thetaY += (lastMouse.y - event.clientY)/4;

			lastMouse.x = event.clientX;
			lastMouse.y = event.clientY;
		}		
	}
	
	/*DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/	

