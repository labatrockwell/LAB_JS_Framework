// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/ThreeApp.js");
LAB.require("js/utils/utils.js");

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
   
   var camera;	
   var orthoCamera;
   
   var fboTexture;
   var screenQuad;
   var simpTexShader;
   var screen;
   
	// ===========================================
	// ===== SETUP
	// ===========================================

		
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         camera = new LAB.three.Camera();
         camera.usePushPop( true );
         orthoCamera = new LAB.three.Camera();
         orthoCamera.makeOrtho();
         
         //fbo textures
         fboTexture = new THREE.WebGLRenderTarget(window.innerWidth/8, window.innerHeight/8, 
                                                  {  minFilter: THREE.LinearFilter,
                                                     magFilter: THREE.LinearFilter,
                                                     format: THREE.RGBAFormat 
                                                  });
         
         //shaders
         uniforms = {   
            inTex: { type: "t", value: 0, texture: fboTexture },
            texDim: { type: "v2", value: new THREE.Vector2( fboTexture.width, fboTexture.height )},
         };
         simpTexShader = new LAB.three.Shader({ name: 'shaders/boxFilter', uniforms: uniforms });
         
         //post processing( drawing the fbo to the screen ) setup
         screenQuad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), simpTexShader );
         screenQuad.position.set( window.innerWidth/2, window.innerHeight/2, 0);
         screen = new LAB.three.Object( LAB.self.renderer, null );
         screen.addObject( screenQuad );
         
         //geometry and scene
         var geom = new THREE.CubeGeometry( 20, 20, 20 );
         for(var i=0; i<40; i++){
            var cubeMesh = new THREE.Mesh( geom, new THREE.MeshNormalMaterial());
            cubeMesh.position.set(labRandom( window.innerWidth/2 - 200,window.innerWidth/2 + 200),
                                  labRandom( window.innerHeight/2 - 200,window.innerHeight/2 + 200),
                                  labRandom( -200, 200));
            cubeMesh.scale.set( labRandom(1, 5 ), labRandom(1, 15), labRandom(1, 5) );
            cubeMesh.rotation.set(labRandom(0, 360), labRandom(0, 360), labRandom(0, 360) ); 
            this.scene.addObject( cubeMesh );
         }
         
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor( .2, .2, .24, 1 );
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
      gl.enable( gl.DEPTH_TEST );
      
      camera.pushMatrix();
      camera.translateMatrix(2*lastMouse.x - window.innerWidth, 
                             2*lastMouse.y - window.innerHeight,
                             0);
      camera.lookAt( window.innerWidth/2, window.innerHeight/2, 0 );
      this.renderer.render( this.scene, camera, fboTexture, true );//render the scene to the fboTexture and clear = true
      camera.popMatrix();
      
      gl.disable( gl.DEPTH_TEST );
      screen.draw( orthoCamera );
            
   }
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
   
   this.onMouseMoved		= function( x, y )
   {
      lastMouse.x = x;
      lastMouse.y = y;
   }		
   
   this.onMousePressed	= function (x,y){
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

