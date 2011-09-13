// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/ThreeApp.js");
LAB.require("js/utils/utils.js");
LAB.require("models/holyMesh.js");
//LAB.require("shaders/basicShader.vert");

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
   var particleShader;
   var particles;
   var particleSystem;
   
	// ===========================================
	// ===== SETUP
	// ===========================================

		
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         labCam = new LAB.three.Camera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
         labCam.setToWindowPerspective();
         
         //shaders
         //TODO: add birthTime & velocity attributes
         var shaderUniforms = {
            attScale: { type: "f", value: window.innerHeight/2  },
            radius: { type: "f", value: 10 },
            particleTexture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "textures/sphere.png" )}
         }
         particleShader = new LAB.three.Shader({name: 'shaders/particleShader', uniforms: shaderUniforms } );
         
         particles = new LAB.three.Geometry();
         particles.vel = [];
         for(var i=0; i<6000; i++){
            particles.addVertex(labRandom(0, window.innerWidth), labRandom(0, window.innerHeight),labRandom(-200, 200));
            particles.vel[i] = new THREE.Vector3(0,0,0);
         }
         particleSystem = new THREE.ParticleSystem( particles, particleShader ); 
         
         this.scene.addObject( particleSystem );
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      //update particle positions
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
      
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor( .2, .2, .24, 1 );
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
      gl.disable( gl.DEPTH_TEST );
      gl.enable( gl.BLEND);
      gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
//      gl.blendFunc( gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
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
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

