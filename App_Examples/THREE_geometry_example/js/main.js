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
   var materials = [];
   var circle;
   
   var geom;
   var mesh;
   var lines;
   var lineMesh;
   
   var meshShader;
   var lineShader;
   var testMat;
   
   var smoothMat;
   
   var blankObjects = [];
   var attributes, uniforms;
   var mvMat1, mvMat2;
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
         materials.push( new THREE.MeshLambertMaterial( { color: 0xffffff} ));
         materials.push( new THREE.MeshPhongMaterial( { color: 0xffffff} ));
         
         //lights
         ambientLight = new THREE.AmbientLight( 0x888888 );
         this.scene.addLight( ambientLight );
         
         pointLight = new THREE.PointLight( 0xeeeeff );
         pointLight.position.set( window.innerWidth/2, window.innerHeight/2, 300 );
         this.scene.addLight( pointLight );
         
         
         
         //shaders
         var shaderUniforms = {
            col:   { type: "v3", value: new THREE.Vector3() },
            lightPos: { type: "v3", value: pointLight.position}
         }
         meshShader = new LAB.three.Shader({ name: 'shaders/basicShader', uniforms: shaderUniforms } );
         
         
         //geometry
         geom = new LAB.three.Geometry();
         geom.loadLabModel( holyMesh );
         geom.calculateNormals();
         
         mesh = new THREE.Mesh( geom, meshShader );//materials[3] );
         mesh.scale.set( 15, 15, 15 );
         this.scene.addObject( mesh );
         
         
         //lines
         lines = new LAB.three.Geometry();
         var fi, u, v;
         colors = [];
         for(var i=0; i<5000; i++){
            fi = labRandomInt(0, geom.faces.length);
            u = labRandom(0,1);
            v = labRandom(0,1);
            
            var fPos = geom.getPointOnFace(fi, u, v );
            var fNorm = geom.getSmoothedNormalOnFace(fi, u, v );
            
            var hairLength = labRandom( 2, 8 );
            lines.addVertex( fPos.x, fPos.y, fPos.z );
            lines.addVertex(fPos.x + fNorm.x*hairLength,
                            fPos.y + fNorm.y*hairLength,
                            fPos.z + fNorm.z*hairLength );
            lines.colors.push( new THREE.Color().setRGB( 0, 0, 0) );
            lines.colors.push( new THREE.Color().setRGB( 1, 0, 0) );
         }
         
         mvMat2 = new THREE.Matrix4();//this is used as smoothed modelview matrix for the ends of the hairs
         uniforms = {   col:{ type: "v3", value: new THREE.Vector3()},
                        mvMat2: {type: "m4", value: mvMat2 },
         };
         lineShader = new LAB.three.Shader({
                                           uniforms: uniforms,
                                           name: 'shaders/lineShader',
                                           }) ;
         
         lineShader.linewidth = .5;//this won't be set if it's included in the uniforms becuase the LAB.shader is not an instance of a THREE.LineShader
         lineShader.vertexColors = true;//THREE.LINES isn't setup for custome attributes :( so we have to work around it using colors to pass 
         
         lineMesh = new THREE.Line( lines, lineShader, THREE.LinePieces );
         lineMesh.scale.copy( mesh.scale );
         this.scene.addObject( lineMesh );
         
         //make some objects that don't render, we just need their _modelViewMatrix
         var blankShader = new LAB.three.Shader({name: 'shaders/blank'});
         
			var cubeGeo = new THREE.CubeGeometry( 1,1,1 );
         for(var i=0; i<2; i++){
            
            blankObjects.push( new THREE.Mesh( cubeGeo, blankShader) );
            this.scene.addObject( blankObjects[i] );
            blankObjects[i].position.set( window.innerWidth/2, window.innerHeight/2, 0)
            blankObjects[i].scale.copy( mesh.scale );
         }
         
         
         
         this.renderer.render( this.scene, labCam );//this sets up the matirices that we'll be copying
         labLog( mesh._modelViewMatrix );
         labLog( blankObjects[0]._modelViewMatrix );
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      mesh.position.set( lastMouse.x, window.innerHeight - lastMouse.y, 0);
      mesh.rotation.set(labDegToRad( lastMouse.x * .3 ),
                        labDegToRad( lastMouse.y * .3 ),
                        labDegToRad( lastMouse.x * .1 ));
      lineMesh.position.copy( mesh.position );
      lineMesh.rotation.copy( mesh.rotation );
      
      var step = .9/(blankObjects.length-1);
      var p = mesh.position;
      var r = mesh.rotation;
      var w, mw;//weight
      for(var i=0; i<blankObjects.length; i++){
         w = step * i;
         mw = 1 - w;
         blankObjects[i].position.set(mesh.position.x*mw + blankObjects[i].position.x*w,
                                     (mesh.position.y - 40 )*mw + blankObjects[i].position.y*w,
                                      mesh.position.z*mw + blankObjects[i].position.z*w );
         blankObjects[i].rotation.set(mesh.rotation.x*mw + blankObjects[i].rotation.x*w,
                                     mesh.rotation.y*mw + blankObjects[i].rotation.y*w,
                                      mesh.rotation.z*mw + blankObjects[i].rotation.z*w );

      }
      mvMat2.copy( blankObjects[1]._modelViewMatrix );
      
      meshShader.uniforms.col.value.set(.5 + Math.cos( this.getElapsedTimeMillis() * .0001 ) * .5,
                                       .5 + Math.cos( this.getElapsedTimeMillis() * .00001 ) * .5,
                                       .5 + Math.cos( this.getElapsedTimeMillis() * .001 ) * .5);
      lineShader.uniforms.col.value.copy( meshShader.uniforms.col.value );
            
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor( 1, 1, 1.1, 1 );
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
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
      labLog( mesh );
      for(var i=0; i<blankObjects.length; i++){
         labLog( blankObjects[i]._modelViewMatrix );
      }
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

