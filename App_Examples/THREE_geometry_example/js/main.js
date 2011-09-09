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
   var lines;
   var lineMesh;
   
   var labShader;
   
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
            col:   { type: "v3", value: new THREE.Vector3( .1, .2, .4) },
            lightPos: { type: "v3", value: pointLight.position}
         }
         labShader = new LAB.three.Shader({ name: 'shaders/basicShader', uniforms: shaderUniforms } );
         
         
         //geometry
         geom = new LAB.three.Geometry();
         geom.loadLabModel( holyMesh );
         geom.calculateNormals();
         
         mesh = new THREE.Mesh( geom, labShader );//materials[3] );
         mesh.scale.set( 15, 15, 15 );
         this.scene.addObject( mesh );
         
         //lines
         lines = new LAB.three.Geometry();
         var fi, u, v;
         for(var i=0; i<5000; i++){
            fi = labRandomInt(0, geom.faces.length);
            u = labRandom(0,1);
            v = labRandom(0,1);
            
            var fPos = geom.getPointOnFace(fi, u, v );
            var fNorm = geom.getSmoothedNormalOnFace(fi, u, v );
            var hairLength = labRandom( .5, 3 );
            lines.addVertex( fPos.x, fPos.y, fPos.z );
            lines.addVertex(fPos.x + fNorm.x*hairLength,
                            fPos.y + fNorm.y*hairLength,
                            fPos.z + fNorm.z*hairLength );
         }
         
         var lineMat = new THREE.LineBasicMaterial( { color: 333355, linewidth: .1, depthTest: true  } );
         lineMesh = new THREE.Line( lines, lineMat, THREE.LinePieces );
         lineMesh.scale.copy( mesh.scale );
         this.scene.addObject( lineMesh );
      }
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      mesh.position.set( lastMouse.x, window.innerHeight - lastMouse.y, 0);
      mesh.rotation.set(labDegToRad( lastMouse.x * .2 ),
                        labDegToRad( lastMouse.y * .2 ),
                        labDegToRad( lastMouse.x * .1 ));
      lineMesh.position.copy( mesh.position );
      lineMesh.rotation.copy( mesh.rotation );
      
      labShader.uniforms.col.value.set(.5 + Math.cos( this.getElapsedTimeMillis() * .0001 ) * .5,
                                       .5 + Math.cos( this.getElapsedTimeMillis() * .00001 ) * .5,
                                       .5 + Math.cos( this.getElapsedTimeMillis() * .001 ) * .5);
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
      labLog( labShader );
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

