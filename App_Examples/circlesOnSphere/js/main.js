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
   var circles = [];
   var radius = 200;
   var center;
   
   var targetBlend = 0;
   
	// ===========================================
	// ===== SETUP
	// ===========================================

		
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         camera = new LAB.three.Camera();
         camera.usePushPop( true );
         
         //shaders
         center = new THREE.Vector3( window.innerWidth/2, window.innerHeight/2, 0 );
         uniforms = {   
            col:{ type: "v3", value: new THREE.Vector3( 1, 1, 0 )},
            radius: { type: "f", value: radius },
            center: { type: "v3", value: center },
         };
         lineShader = new LAB.three.Shader({ name: 'shaders/lineShader', uniforms: uniforms });
         lineShader.linewidth = 2.5;
         
         //geometry
         var subdiv = 90;
         var step = Math.PI * 2 * 1/(subdiv - 1);
         var circle  = new LAB.three.Geometry();
         for(var i=0; i<subdiv; i++){
               circle.addVertex(Math.sin( step*i ), Math.cos( step*i ), 0);
         }
         
         var randPoint = new THREE.Vector3( labRandom(-1,1), labRandom(-1,1), labRandom(-1,1) );
         randPoint.divideScalar( randPoint.length() );
         randPoint.multiplyScalar( radius );
         randPoint.addSelf( center );   

         for(var i=0 ;i<40; i++){
            circles[i] = new THREE.Line( circle, lineShader );
            circles[i].position.copy( randPoint );
            circles[i].lookAt( center );
            circles[i].scale.set( 20*(i+1), 20*(i+1), 20*(i+1) );
            this.scene.addObject( circles[i] );
         }
         
         var sphereGeom = new THREE.SphereGeometry( radius*.975, 40, 40 );
         var sphere = new THREE.Mesh( sphereGeom, new THREE.MeshNormalMaterial() );
         sphere.position.set( window.innerWidth/2, window.innerHeight/2, 0 );
         this.scene.addObject( sphere );
         
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      for( var i=0; i<circles.length; i++){
         circles[i].scale.x += .5;
         circles[i].scale.y += .5;
         circles[i].scale.z += .5;
         
         if(circles[i].scale.x > radius*4){
            circles[i].scale.set(0.001,0.001,0.001); //length can't be zero. zero length means it can't be inverted
         }
      }
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor( .2, .2, .24, 1 );
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
      camera.pushMatrix();
      camera.translateMatrix(2*lastMouse.x - window.innerWidth, 
                             2*lastMouse.y - window.innerHeight,
                             0);
      camera.lookAt( window.innerWidth/2, window.innerHeight/2, 0 );
      this.renderer.render( this.scene, camera );
      camera.popMatrix();
            
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
      
      var randPoint = new THREE.Vector3( labRandom(-1,1), labRandom(-1,1), labRandom(-1,1) );
      randPoint.divideScalar( randPoint.length() );
      randPoint.multiplyScalar( radius );
      randPoint.addSelf( center );
      
      
      for(var i=0 ;i<circles.length; i++){
         circles[i].position.copy( randPoint );
         circles[i].lookAt( center );
      }
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

