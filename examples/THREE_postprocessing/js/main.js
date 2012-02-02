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
	var camera, orthoCamera;
   var elapsedTime;
   var projector;
   
   var ambientLight;
   var pointLight;
   var mesh;

   var geoms = [];
   var pointer;
   
   var basicTextureShader;
   
   var screen;
   var depthShader;
   var normalMat;
   var depthTexture;
   var blurTexture;
   var ssaoShader;
   var depthScene;
   
   var blur;
   var blurShader;
   
   var stats;
   var gui;
	// ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
      //stats
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      this.container.appendChild( stats.domElement );
      
		// catch mouse events!
		this.registerMouseEvents();

		//cameras
      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 600;
      
      orthoCamera = new LAB.three.Camera();
      orthoCamera.makeOrtho();
      
   //ssao & blur
      //depth and normal textures
      var ssaoRes = [ window.innerWidth/2, window.innerHeight/2 ];
      depthTexture = new THREE.WebGLRenderTarget(ssaoRes[0], ssaoRes[1],
                                                 {  minFilter: THREE.LinearFilter,
                                                 magFilter: THREE.NearestFilter,
                                                 format: THREE.RGBAFormat,
                                                 });
      normalTexture = new THREE.WebGLRenderTarget(ssaoRes[0], ssaoRes[1],
                                                  {  minFilter: THREE.LinearFilter,
                                                  magFilter: THREE.NearestFilter,
                                                  format: THREE.RGBFormat,
                                                  });
      ssaoTexture = new THREE.WebGLRenderTarget(ssaoRes[0], ssaoRes[1],
                                                {  minFilter: THREE.LinearFilter,
                                                magFilter: THREE.NearestFilter,
                                                format: THREE.RGBFormat,
                                                });
      blurTexture = new THREE.WebGLRenderTarget(ssaoRes[0], ssaoRes[1],
                                                {  minFilter: THREE.LinearFilter,
                                                magFilter: THREE.NearestFilter,
                                                format: THREE.RGBFormat,
                                                });
      normalMat = new THREE.MeshNormalMaterial();

      var halfSphereSamples = [-0.717643236477, -0.688175618649, 0.273249441045, -0.305361618869, -0.95300924778, 0.101219129631, 0.305361649948, -0.95300924778, 0.101219129631, 0.717643236477, -0.688175618649, 0.273249441045, -0.448564588874, -0.507219731808, 0.753300700721, -0.0284153218579, -0.664495944977, 0.753300700721, -0.692949481281, 0.0272486507893, 0.753300633352, -0.345248291778, -0.271523624659, 0.999093570452, 0.283150254848, -0.33107188344, 0.999093570452, 0.528938805438, -0.430145829916, 0.753300633352, -0.528938805438, 0.430145919323, 0.753300633352, -0.283150192691, 0.331071943045, 0.999093570452, 0.345248322856, 0.271523594856, 0.999093570452, 0.692949481281, -0.0272486060858, 0.753300633352, -0.717643112163, 0.688175678253, 0.273249407361, 0.028415399554, 0.664495944977, 0.753300700721, 0.448564588874, 0.507219791412, 0.753300633352, 0.71764317432, 0.688175618649, 0.273249373677, -0.305361525634, 0.953009307384, 0.101219028578, 0.305361649948, 0.95300924778, 0.101219062263, 0.993816845531, 0.292822957039, 0.101219028578, 0.993816845531, -0.292822986841, 0.101219028578, -0.993816845531, 0.292823016644, 0.101219028578, -0.993816907688, -0.292822927237, 0.101219062263];
      
      uniforms = { 
         exponent: { type: "f", value: 1. },
         sampleRadius: { type: "f", value: .03 },
         minThreshold: { type: "f", value: .004 },
         maxThreshold: { type: "f", value: .2 },
         inTex:   { type: "t", value: 0, texture: depthTexture  },
         normTex:   { type: "t", value: 1, texture: normalTexture  },
         ssaoSamples:   { type: "fv", value: halfSphereSamples },
         time: { type: "f", value: elapsedTime },//
      };
      ssaoShader = new LAB.three.Shader({ name: 'shaders/basicTexture', uniforms: uniforms });
      var gausBlur5x5 = [ -2, -2, 0.00390625,  -2, -1, 0.015625,  -2, 0, 0.0234375,  -2, 1, 0.015625,  -2, 2, 0.00390625,  -1, -2, 0.015625,  -1, -1, 0.0625,  -1, 0, 0.09375,  -1, 1, 0.0625,  -1, 2, 0.015625,  0, -2, 0.0234375,  0, -1, 0.09375,  0, 0, 0.140625,  0, 1, 0.09375,  0, 2, 0.0234375,  1, -2, 0.015625,  1, -1, 0.0625,  1, 0, 0.09375,  1, 1, 0.0625,  1, 2, 0.015625,  2, -2, 0.00390625,  2, -1, 0.015625,  2, 0, 0.0234375,  2, 1, 0.015625, 2, 2, 0.00390625 ];
      
      //7x7 guasian blur kernel. x&y = pixel offset, z = weight per sample
      //var gausBlur7x7 = [ -3, -3, 0.00000067, -3, -2, 0.00002292, -3, -1, 0.00019117, -3, 0, 0.00038771, -3, 1, 0.00019117, -3, 2, 0.00002292, -3, 3, 0.00000067, -2, -3, 0.00002292, -2, -2, 0.00078633, -2, -1, 0.00655965, -2, 0, 0.0133037, -2, 1, 0.00655965, -2, 2, 0.00078633, -2, 3, 0.00002292, -1, -3, 0.00019117, -1, -2, 0.00655965, -1, -1, 0.0547216, -1, 0, 0.110982, -1, 1, 0.0547216, -1, 2, 0.00655965, -1, 3, 0.00019117, 0, -3, 0.00038771, 0, -2, 0.0133037, 0, -1, 0.110982, 0, 0, 0.225084, 0, 1, 0.110982, 0, 2, 0.0133037, 0, 3, 0.00038771, 1, -3, 0.00019117, 1, -2, 0.00655965, 1, -1, 0.0547216, 1, 0, 0.110982, 1, 1, 0.0547216, 1, 2, 0.00655965, 1, 3, 0.00019117, 2, -3, 0.00002292, 2, -2, 0.00078633, 2, -1, 0.00655965, 2, 0, 0.0133037, 2, 1, 0.00655965, 2, 2, 0.00078633, 2, 3, 0.00002292, 3, -3, 0.00000067, 3, -2, 0.00002292, 3, -1, 0.00019117, 3, 0, 0.00038771, 3, 1, 0.00019117, 3, 2, 0.00002292, 3, 3, 0.00000067];
      
      blurUniforms = {   
         inTex: { type: "t", value: 0, texture: ssaoTexture },
         texDimInv: { type: "v2", value: new THREE.Vector2( 1/blurTexture.width, 1/blurTexture.height )},
         blurSamples:   { type: "fv", value: gausBlur5x5 },
         radius: { type: "f", value: 1. },
         mult: { type: "f", value: 1. },
      };
      blurShader = new LAB.three.Shader({ name: 'shaders/blurFilter', uniforms: blurUniforms });
      
   //post processing geometry. quad 
      screenQuad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), ssaoShader );
      screenQuad.doubleSided = true;
      screenQuad.position.set( window.innerWidth/2, window.innerHeight/2, 0);
      screenQuad.scale.set(1, -1, 1 );//flip it, otherwise the fbo will be up-side down when we draw it to the screen
      screen = new LAB.three.Object( this.renderer, null );
      screen.addObject( screenQuad );
      
      blurQuad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), blurShader );
      blurQuad.doubleSided = true;
      blurQuad.position.set( window.innerWidth/2, window.innerHeight/2, 0);
      blurQuad.scale.set(1, -1, 1 );//flip it, otherwise the fbo will be up-side down when we draw it to the screen
      blur = new LAB.three.Object( this.renderer, null );
      blur.addObject( blurQuad );

      ambientLight = new THREE.AmbientLight( 0x222222 );
      _self.scene.add( ambientLight );
      
      pointLight = new THREE.PointLight();// { color: 0xffffff} );
      pointLight.position.copy( camera.position );
      _self.scene.add( pointLight );
      
      var loader = new THREE.JSONLoader();
      var scn = _self.scene;
      var onGeometry = function( geometry ) {
         mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( {shading : THREE.SmoothShading } ) );
         //mesh = new THREE.Mesh( new THREE.TorusGeometry( 200, 80, 20, 20 ), new THREE.MeshNormalMaterial() );
         console.log( mesh );
         mesh.scale.set( 15, 15, 15 );
         _self.scene.add( mesh );
      };
      loader.load( "models/randomMesh.js", onGeometry );
      
      
      //depth fbo with 32 bit texture hack
      var shaderUniforms = {
      nearClip:   { type: "f", value: 2 },
      farClip:   { type: "f", value: 1000 },
      }
      depthShader = new LAB.three.Shader({ name: 'shaders/depth32', uniforms: shaderUniforms } );
      
      
      
      //GUI
      var ssaoUniformController  = {
         
      exponent:	1.,
      radius: 		.035,
      minThreshold:	0.004,
      maxThreshold:	.2,
         
      };
      
      var matChanger = function( ) {
         
         ssaoShader.uniforms["sampleRadius"].value = ssaoUniformController.radius;
         ssaoShader.uniforms["minThreshold"].value = ssaoUniformController.minThreshold;
         ssaoShader.uniforms["maxThreshold"].value = ssaoUniformController.maxThreshold;
         ssaoShader.uniforms["exponent"].value = ssaoUniformController.exponent;
         
      };
      
      gui = new GUI();
      gui.add( ssaoUniformController, "exponent", .51, 10, .001 ).onChange( matChanger );
      gui.add( ssaoUniformController, "radius", 0.001, .100, 0.001 ).onChange( matChanger );
      gui.add( ssaoUniformController, "minThreshold", 0.00001, .01, 0.00001 ).onChange( matChanger );
      gui.add( ssaoUniformController, "maxThreshold", 0.01, .5, 0.0001 ).onChange( matChanger );
      

	}
	
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
      stats.update();
      elapsedTime = this.getElapsedTimeSeconds();
      ssaoShader.uniforms.time.value = elapsedTime * .0001;
      camera.position.set( Math.sin( lastMouse.x * .01 ) * 600, lastMouse.y*2 - 600, Math.cos( lastMouse.x * .01 ) * 600);
	}
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
      gl.enable( gl.DEPTH_TEST );
      gl.disable( gl.BLEND );
      
      gl.clearColor( 0,0,0,1);//0,0,0,1 seems to work best
      _self.scene.overrideMaterial = depthShader;
      this.renderer.render( _self.scene, camera, depthTexture, true );
      
      gl.clearColor( .5,.5,.5,0);//this changes to 0,0,0 in the shader
      _self.scene.overrideMaterial = normalMat;
      this.renderer.render( _self.scene, camera, normalTexture, true );
      
      gl.enable( gl.DEPTH_TEST );
      gl.disable( gl.CULL_FACE );
      screen.draw( orthoCamera, ssaoShader, ssaoTexture, true );
      
//      blurShader.uniforms.inTex.texture = ssaoTexture;
//      blur.draw(orthoCamera, blurShader, normalTexture, true);
//      blurShader.uniforms.inTex.texture = normalTexture;
      blur.draw( orthoCamera )
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