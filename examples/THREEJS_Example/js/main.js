// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/ThreeApp.js");

var demoApp;

$(document).ready( function() {
                  DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
                  demoApp 	= new DemoApp();
                  // is there a good way to call this automatically?
                  demoApp.begin();
                  });

// ===========================================
// ===== DEMO APP
// ===========================================

DemoApp = function(){
   LAB.app.ThreeApp.call( this );		
   
   var _self = this;
   
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
			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         labCam = new LAB.three.Camera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
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
         
         particles = new LAB.three.Geometry();
         particles.vel = [];
         for(var i=0; i<20000; i++){
            particles.addVertex(LAB.random(0, window.innerWidth), LAB.random(0, window.innerHeight),LAB.random(-200, 200));
            particles.vel[i] = new THREE.Vector3(0,0,0);
         }
         
         var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xefefff, size: 1.5, sizeAttenuation: false } );
         labParticleObj = new LAB.three.Object( this.renderer, null );// (renderer, scene) if scene == null a new one is created for the object
         labParticleObj.addObject( new THREE.ParticleSystem( particles, particleMaterial ) ); 
         
         circle = new LAB.three.Geometry();
         for(var i=0; i<10; i++){
            //add vertices to geometry
            circle.addVertex( Math.sin( Math.PI * 2 * i/10 )*50, Math.cos( Math.PI * 2 * i/10)*50, 0 );
         }
         for(var i=1; i<circle.vertices.length-1;i++){
            //create faces from vertex indices
            circle.addFace( 0, i+1, i);
         }
         
         circle.findVertexEdges();
         circle.findFaceEdges();
         circle.findVertexFaces();
         circle.computeFaceNormals();
         circle.computeVertexNormals();
         
         
         //calculate normals amd add to scene
         //circle.calcuateNormals();
         circleMesh = new THREE.Mesh( circle, materials[0] );
         this.scene.addObject( circleMesh );
         
		}
      
		function generateCubes(){
			// add some random cubes
			var geometry = new THREE.CubeGeometry( 20, 20, 20 );

			for ( var i = 0; i < 300; i ++ ) 
         {
				var object = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial());
				object.position.set(LAB.random(0, window.innerWidth),
                                LAB.random(0, window.innerHeight),
                                0);
				object.rotation.set(LAB.degToRad( LAB.random(0,360 )),
                                LAB.degToRad( LAB.random(0,360 )),
                                LAB.degToRad( LAB.random(0,360 )));
				object.scale.set(LAB.random( .25, 1.75),
                             LAB.random( .25, 1.75),
                             LAB.random( .25, 1.75));
            cubes.push( object );
				LAB.self.scene.addObject( object );
			}
         cubes[1].scale.set( 2, .5, .25 );
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
         cubes[i].rotation.set(LAB.degToRad( cubes[i].position.x ),
                               LAB.degToRad( cubes[i].position.y ),
                               LAB.degToRad( cubes[i].position.z ));
      }
      
      //move circle to cube[0]'s screen position
      circleMesh.position.copy( labCam.projectToScreen( cubes[0].position ) );
      
      var screenCoord = new THREE.Vector3(lastMouse.x, window.innerHeight - lastMouse.y, 0.5);
      cubes[1].position.copy( labCam.projectToWorld( screenCoord ));

   }
	
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor(.2 + Math.cos( this.getElapsedTimeMillis() * .0001 ) * .05,
                    .2 + Math.cos( this.getElapsedTimeMillis() * .00001 ) * .05,
                    .2 + Math.cos( this.getElapsedTimeMillis() * .001 ) * .05,
                    1);
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      //gl.disable( gl.CULL_FACE );
      
      //draw particles
      labParticleObj.draw( labCam );
      
      // should this auto-render? <--- LB: I think this needs to stay here so that we can draw multiple objects with multiple scenes
      this.renderer.render( this.scene, labCam );
      
   }
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
   
   this.onMouseMoved		= function( x, y )
   {
      lastMouse.x = x;
      lastMouse.y = y;
   }		
   
   this.onMousePressed	= function (x,y)
   {
      labLog( circle );
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	
