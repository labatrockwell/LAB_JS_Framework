// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/ThreeApp.js");
LAB.require("js/utils/utils.js");
LAB.require("js/lab/labThree/LabThreeCamera.js");
LAB.require("js/lab/labThree/LabThreeGeometry.js");
LAB.require("js/lab/labThree/LabThreeObject.js");
LAB.require("js/lab/labThree/LabThreeUtils.js");

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
            
		var labCam;	
      var materials = [];
      var particles;
      var cubes = [];
      var circle, circleMesh;
      
	// ===========================================
	// ===== SETUP
	// ===========================================
		
		this.setup = function (){
         gl = this.renderer.getContext();

			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         labCam = new LabThreeCamera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
         labCam.setToWindowPerspective();
         
         //materials
         materials.push( new THREE.MeshNormalMaterial() );
         materials.push( new THREE.MeshBasicMaterial( { color: 0xffff33} ));
         materials.push( new THREE.MeshLambertMaterial( { color: 0xff33ff} ));
         materials.push( new THREE.MeshPhongMaterial( { color: 0x33ffff} ));
         
         //lights
         ambientLight = new THREE.AmbientLight( 0x888888 );
         this.scene.addLight( ambientLight );
         
         pointLight = new THREE.PointLight( 0xeeeeff );
         pointLight.position.set( 0, -1000, 100 );
         this.scene.addLight( pointLight );
         
         //geometry
			generateCubes();
         
         particles = new LabThreeGeometry();
         particles.vel = [];
         for(var i=0; i<20000; i++){
            particles.addVertex(labRandom(0, window.innerWidth), labRandom(0, window.innerHeight),labRandom(-200, 200));
            particles.vel.push( new THREE.Vector3(0,0,0) );
         }
         
         var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xffff33, size: 2.5, sizeAttenuation: false } );
         labParticleObj = new LabThreeObject( this.renderer, null );// (renderer, scene) if scene == null a new one is created for the object
         labParticleObj.addObject( new THREE.ParticleSystem( particles, particleMaterial ) ); 
         
         circle = new LabThreeGeometry();
         for(var i=0; i<30; i++){
            //add vertices to geometry
            circle.addVertex( Math.sin( Math.PI * 2 * i/30 )*50, Math.cos( Math.PI * 2 * i/30)*50, 0 );
         }
         for(var i=0; i<circle.vertices.length-1;i++){
            //create faces from vertex indices
            circle.addFace( 0, i, i+1);
         }
         //calculate normals amd add to scene
         circle.calcuateNormalsSmooth();
         circleMesh = new THREE.Mesh( circle, materials[3] );
         this.scene.addObject( circleMesh );
		}
      
		function generateCubes(){
			// add some random squares

			var geometry = new THREE.CubeGeometry( 20, 20, 20 );

			for ( var i = 0; i < 100; i ++ ) {

				var object = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial());
				object.position.set(labRandom(0, window.innerWidth),
                                labRandom(0, window.innerHeight),
                                0);
				object.rotation.set(labDegToRad( labRandom(0,360 )),
                                labDegToRad( labRandom(0,360 )),
                                labDegToRad( labRandom(0,360 )));
				object.scale.set(labRandom( .25, 1.75),
                             labRandom( .25, 1.75),
                             labRandom( .25, 1.75));
            cubes.push( object );
				LAB.self.scene.addObject( object );
			}
		}
		
	// ===========================================
	// ===== UPDATE
	// ===========================================

		this.update = function (){
                  
         //update particles
         var pPos;
         var force = new THREE.Vector3();
         var attractor = new THREE.Vector3(lastMouse.x, window.innerHeight - lastMouse.y, 0 );
         var accel = .3;
         var attenuation = .9975;
         for(var i=0; i<particles.vertices.length; i++){
            pPos = particles.vertices[i].position;
            force.set(attractor.x - pPos.x,
                      attractor.y - pPos.y,
                      attractor.z - pPos.z);
            force.normalize();
            particles.vel[i].multiplyScalar( attenuation );
            particles.vel[i].addSelf( force.multiplyScalar( accel ) );
            
            particles.vertices[i].position.addSelf( particles.vel[i] );
         }
         particles.update();
         
         //move and rotate cubes to particles
         for(var i=0; i<cubes.length; i++){
            cubes[i].position.copy( particles.vertices[i].position );
            cubes[i].rotation.set(labDegToRad( cubes[i].position.x ),
                                   labDegToRad( cubes[i].position.y ),
                                   labDegToRad( cubes[i].position.z ));
         }
         
         //move circle to mouse
         circleMesh.position.set( lastMouse.x, window.innerHeight - lastMouse.y, 0 );
         circleMesh.rotation.set( labDegToRad( this.getElapsedTimeMillis() *.1), labDegToRad( this.getElapsedTimeMillis() *.01), 0);
      }
	
	// ===========================================
	// ===== DRAW
	// ===========================================

		this.draw = function (){
         
         gl.clearColor(.2 + Math.cos( this.getElapsedTimeMillis() * .0001 ) * .05,
                       .2 + Math.cos( this.getElapsedTimeMillis() * .00001 ) * .05,
                       .2 + Math.cos( this.getElapsedTimeMillis() * .001 ) * .05,
 						1.);
         gl.clear( gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT );
         gl.disable( gl.CULL_FACE );
			
			// should this auto-render? <--- LB: I think this needs to stay here so that we can draw multiple objects with multiple scenes
			this.renderer.render( this.scene, labCam );
         
         //draw particles
         //gl.disable( gl.DEPTH_TEST );
         labParticleObj.draw( labCam );
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

