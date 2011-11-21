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
   
   var camera;	
   var orthoCamera;
   
   var fboTexture, fboTexture2;
   var screenQuad;
   var simpTexShader;
   var basicTexture;
   var screen;
   var spheres = [];
   
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
         fboTexture = new THREE.WebGLRenderTarget(window.innerWidth/2, window.innerHeight/2,
                                                  {  minFilter: THREE.LinearFilter,
                                                  magFilter: THREE.NearestFilter,
                                                  format: THREE.RGBAFormat,
                                                  });
         fboTexture2 = new THREE.WebGLRenderTarget(window.innerWidth/2, window.innerHeight/2,
                                                  {  minFilter: THREE.LinearFilter,
                                                  magFilter: THREE.NearestFilter,
                                                  format: THREE.RGBAFormat,
                                                  });
         
         //shaders
         //5x5 guasian blur kernel. x&y = pixel offset, z = weight per sample
         var gausBlur5x5 = [ -2, -2, 0.00390625,  -2, -1, 0.015625,  -2, 0, 0.0234375,  -2, 1, 0.015625,  -2, 2, 0.00390625,  -1, -2, 0.015625,  -1, -1, 0.0625,  -1, 0, 0.09375,  -1, 1, 0.0625,  -1, 2, 0.015625,  0, -2, 0.0234375,  0, -1, 0.09375,  0, 0, 0.140625,  0, 1, 0.09375,  0, 2, 0.0234375,  1, -2, 0.015625,  1, -1, 0.0625,  1, 0, 0.09375,  1, 1, 0.0625,  1, 2, 0.015625,  2, -2, 0.00390625,  2, -1, 0.015625,  2, 0, 0.0234375,  2, 1, 0.015625, 2, 2, 0.00390625 ];
         
         //7x7 guasian blur kernel. x&y = pixel offset, z = weight per sample
         //var gausBlur7x7 = [ -3, -3, 0.00000067, -3, -2, 0.00002292, -3, -1, 0.00019117, -3, 0, 0.00038771, -3, 1, 0.00019117, -3, 2, 0.00002292, -3, 3, 0.00000067, -2, -3, 0.00002292, -2, -2, 0.00078633, -2, -1, 0.00655965, -2, 0, 0.0133037, -2, 1, 0.00655965, -2, 2, 0.00078633, -2, 3, 0.00002292, -1, -3, 0.00019117, -1, -2, 0.00655965, -1, -1, 0.0547216, -1, 0, 0.110982, -1, 1, 0.0547216, -1, 2, 0.00655965, -1, 3, 0.00019117, 0, -3, 0.00038771, 0, -2, 0.0133037, 0, -1, 0.110982, 0, 0, 0.225084, 0, 1, 0.110982, 0, 2, 0.0133037, 0, 3, 0.00038771, 1, -3, 0.00019117, 1, -2, 0.00655965, 1, -1, 0.0547216, 1, 0, 0.110982, 1, 1, 0.0547216, 1, 2, 0.00655965, 1, 3, 0.00019117, 2, -3, 0.00002292, 2, -2, 0.00078633, 2, -1, 0.00655965, 2, 0, 0.0133037, 2, 1, 0.00655965, 2, 2, 0.00078633, 2, 3, 0.00002292, 3, -3, 0.00000067, 3, -2, 0.00002292, 3, -1, 0.00019117, 3, 0, 0.00038771, 3, 1, 0.00019117, 3, 2, 0.00002292, 3, 3, 0.00000067];
 
         uniforms = {   
            inTex: { type: "t", value: 0, texture: fboTexture },
            texDimInv: { type: "v2", value: new THREE.Vector2( 1/fboTexture.width, 1/fboTexture.height )},
            blurSamples:   { type: "fv", value: gausBlur5x5 },
            radius: { type: "f", value: 1 },
            mult: { type: "f", value: 1.3 },
         };
         simpTexShader = new LAB.three.Shader({ name: 'shaders/blurFilter', uniforms: uniforms });
         
         //post processing( drawing the fbo to the screen ) setup
         screenQuad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), simpTexShader );
         screenQuad.position.set( window.innerWidth/2, window.innerHeight/2, 0);
         screenQuad.scale.set(1, -1, 1 );//flip it, otherwise the fbo will be up-side down when we draw it to the screen
         screen = new LAB.three.Object( this.renderer, null );
         screen.addObject( screenQuad );
         
         //geometry and scene
         var geom = new THREE.SphereGeometry( 10, 20, 20 );
         for(var i=0; i<100; i++){
            spheres[i] = new THREE.Mesh( geom, new THREE.MeshPhongMaterial());
            spheres[i].position.set(LAB.random( window.innerWidth/2 - 200,window.innerWidth/2 + 200),
                                  LAB.random( window.innerHeight/2 - 200,window.innerHeight/2 + 200),
                                  LAB.random( -200, 200));
            spheres[i].scale.set( LAB.random(1, 2.5 ), LAB.random(1, 25), LAB.random(1, 5) );
            spheres[i].rotation.set(LAB.random(0, 360), LAB.random(0, 360), LAB.random(0, 360) ); 
            this.scene.addObject( spheres[i] );
         }
         
         //lights
         ambientLight = new THREE.AmbientLight( 0x888888 );
         this.scene.addLight( ambientLight );
         
         pointLight = new THREE.PointLight( 0xeeeeff );
         pointLight.position.set( window.innerWidth/2, window.innerHeight/2, 300 );
         this.scene.addLight( pointLight );
         
         
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      for(var i=0; i<spheres.length; i++){
         spheres[i].rotation.x += .001 * i;
         spheres[i].rotation.y += .0001 * (spheres.length);
      }
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      //render to first buffer
      gl.clearColor( .1, .1, .11, 1 );
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
      gl.disable( gl.CULL_FACE );//the the quad we draw to the screen is flipped so we don't want culling
      //render to second buffer
      simpTexShader.uniforms.inTex.texture = fboTexture;
      simpTexShader.uniforms.radius.value = 2;
      screen.draw( orthoCamera, simpTexShader, fboTexture2 );
      
      //draw second buffer to screen with more blurrrring
      simpTexShader.uniforms.inTex.texture = fboTexture2;
      simpTexShader.uniforms.radius.value = 3;
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

