// load custom class(es) here
LAB.require("js/Sphere.js");

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
	
	var spheres = [];
	var translatePoint = {};
	var rotateVel	   = {};
	var target		   = null;
	var easedTarget		= {};
	
	var touchHandler3D;

	// ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
		ambientLight = new THREE.AmbientLight( 0x666666 );
        this.scene.add( ambientLight );

		var light = new THREE.DirectionalLight( 0x666666, 2 );
		light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
		
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( -1, -1, -1 ).normalize();
		this.scene.add( light );
		
		// register touch handler for a specific scene and camera		
		touchHandler3D = new LAB.three.TouchHandler3D(this.scene, this.camera, true);		
		touchHandler3D.addEventListener(LAB.three.TouchEvent3D.TAP, on3DTap.bind(this));
		
		for (var i=0; i<100; i++){
			spheres[spheres.length] = new Sphere();
			var obj = spheres[spheres.length-1].create(20);
			this.scene.add(obj);
			
			// need to pass the THREE.Mesh object, can't pass the sphere because
			// ray.intersectScene( scene ) returns an array of THREE.Mesh objects
			// that are compared against objects registered with the touch handler
			touchHandler3D.register(spheres[i].object, [LAB.three.TouchEvent3D.TAP]);
		}
		
		translatePoint.x = window.innerWidth/2;
		translatePoint.y = window.innerHeight/2;
		translatePoint.z = 0;
		
		rotateVel.x = rotateVel.y = rotateVel.z = 0;		
	}
	
	function on3DTap(event) {
	
		// get a reference to the object that the down event was fired on
		target = event.object.prt;

		this.camera.rotation.y = translatePoint.x * Math.PI/180;
		this.camera.rotation.x = translatePoint.y * Math.PI/180, 1,0,0;
		
		// translate to the target
		if (target != null){			
			easedTarget.x -= (easedTarget.x - target.x)/10;
			easedTarget.y -= (easedTarget.y - target.y)/10;
			easedTarget.z -= (easedTarget.z - target.z)/10;
			this.camera.position.x = easedTarget.x;
			this.camera.position.y = easedTarget.y;
			this.camera.position.z = easedTarget.z;
		}

		target.scaleX += .1;
		target.scaleY += .1;
		target.scaleZ += .1; 		
		var old = easedTarget;				
		easedTarget = new THREE.Vector3(old.x, old.y, old.z);							
	}
	
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
		rotateVel.x *= .85;
		rotateVel.y *= .85;
		rotateVel.z *= .85;
		
		translatePoint.x += rotateVel.x;
		translatePoint.y += rotateVel.y;
		translatePoint.z += rotateVel.z;
	}
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
		gl.clearColor( 1, 1, 1, 1 );
	    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		
		this.camera.rotation.y = translatePoint.x * Math.PI/180;
		this.camera.rotation.x = translatePoint.y * Math.PI/180, 1,0,0;
		
		// translate to the target
		if (target != null){			
			easedTarget.x -= (easedTarget.x - target.x)/10;
			easedTarget.y -= (easedTarget.y - target.y)/10;
			easedTarget.z -= (easedTarget.z - target.z)/10;
			this.camera.position.x = easedTarget.x;
			this.camera.position.y = easedTarget.y;
			this.camera.position.z = easedTarget.z;
		}
			
		this.renderer.render( this.scene, this.camera );
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
	
	this.onMouseDragged = function( x, y ) {		
		rotateVel.x += (lastMouse.x - x)/10;
		rotateVel.y += (lastMouse.y - y)/10;
		
		lastMouse.x = x;
		lastMouse.y = y;
	}
	
	this.onMouseReleased = function( x, y ) {
		lastMouse.x = x;
		lastMouse.y = y;
	}
}

	/*
	DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/