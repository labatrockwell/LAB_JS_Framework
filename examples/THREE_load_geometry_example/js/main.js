// load graphics base, because this is a graphics app
LAB.require(LAB.src+"app/ThreeApp.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
	demoApp = new DemoApp();
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================
DemoApp = function() {
	LAB.app.ThreeApp.call( this );		
   
	var _self = this;
   
	var lastMouse = {x:0, y:0};
	var camera;
   var projector;
   
   var ambientLight;
   var pointLight;
   var mesh;

   var geoms = [];
   var pointer;
	// ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
		// catch mouse events!
		this.registerMouseEvents();

		//cameras
//        camera = new LAB.three.Camera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
//        camera.setToWindowPerspective();
      
      camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 600;

		ambientLight = new THREE.AmbientLight( 0x222222 );
      _self.scene.addLight( ambientLight );
      
      pointLight = new THREE.PointLight();// { color: 0xffffff} );
      pointLight.position.copy( camera.position );
      _self.scene.addLight( pointLight );
      
      var loader = new THREE.JSONLoader();
      var scn = _self.scene;
      var onGeometry = function( geometry ) {
         var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
         console.log( mesh.geometry );
         mesh.scale.set( 15, 15, 15 );
         _self.scene.addObject( mesh );
      };
      
      loader.load( { model: "models/randomMesh.js", callback: onGeometry } );
      
      
	}
	
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
      elapsedTime = this.getElapsedTimeSeconds();
      camera.position.set( Math.sin( lastMouse.x * .01 ) * 600, lastMouse.y*2 - 600, Math.cos( lastMouse.x * .01 ) * 600);
	}
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
		this.renderer.render( _self.scene, camera );
	}
	
	// ===========================================
	// ===== RESIZE
	// ===========================================
	this.onWindowResized = function( width, height ) {

	}
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
	this.onMouseMoved = function( x, y ) {
		lastMouse.x = x;
		lastMouse.y = y;
	}
	
	this.onMousePressed	= function( x, y ) {
	}
}

	/*
	DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/