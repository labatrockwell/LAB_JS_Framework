// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/ThreeApp.js");

var demoApp;
var dae, voronoi;

$(document).ready( function() {
                  DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
                  demoApp 	= new DemoApp();
                  // is there a good way to call this automatically?
                  //demoApp.begin();//need to load the collada first
                  
                  var loader = new THREE.ColladaLoader();
                  loader.load( './models/monster.dae', function colladaReady( collada ) {
                              
                              dae = collada.scene;
                              skin = collada.skins[ 0 ];
                              
                              dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
                              dae.rotation.x = -Math.PI/2;
                              dae.updateMatrix();                              
                              } );
                  
                  loader.load( './models/voronoi.dae', function colladaReady( collada ) {
                              
                              voronoi = collada.scene;
                              
                              voronoi.scale.x = voronoi.scale.y = voronoi.scale.z = 0.001;
                              voronoi.rotation.x = -Math.PI/2;
                              voronoi.updateMatrix();                              
                              
                              demoApp.begin();//<-- I think this works, we just need to make sure the coloda scene is loaded before we begin
                              } );
                  });

// ===========================================
// ===== DEMO APP
// ===========================================

DemoApp = function(){
   LAB.app.ThreeApp.call( this );		
   
   var _self = this;
   
   var lastMouse = {x:0, y:0};
   
   var camera;
   var t = 0;	
   
   
	// ===========================================
	// ===== SETUP
	// ===========================================

		
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
         
         
         //
         camera = new THREE.Camera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
         camera.position.x = 2;
         camera.position.y = 2;
         camera.position.z = 3;
         
         scene = _self.scene;//new THREE.Scene();
         
         // Grid
         
         var line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } ),
         geometry = new THREE.Geometry(),
         floor = -0.04, step = 1, size = 14;
         
         for ( var i = 0; i <= size / step * 2; i ++ ) {
            
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
            
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
            
         }
         
         var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
         scene.add( line );
         
         // Add the COLLADA
         
         scene.add( dae );
         scene.add( voronoi );
         
         particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
         scene.add( particleLight );
         
         // Lights
         
         scene.add( new THREE.AmbientLight( 0xcccccc ) );
         
         var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
         directionalLight.position.x = Math.random() - 0.5;
         directionalLight.position.y = Math.random() - 0.5;
         directionalLight.position.z = Math.random() - 0.5;
         directionalLight.position.normalize();
         scene.add( directionalLight );
         
         pointLight = new THREE.PointLight( 0xffffff, 4 );
         pointLight.position.x = 10000;
         scene.add( pointLight );
         
         renderer = _self.renderer;//new THREE.WebGLRenderer();
         renderer.setSize( window.innerWidth, window.innerHeight );
         
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
      
      
      if ( t > 30 ) t = 0;
      
      if ( skin ) {
         
         // guess this can be done smarter...
         
         // (Indeed, there are way more frames than needed and interpolation is not used at all
         //  could be something like - one morph per each skinning pose keyframe, or even less,
         //  animation could be resampled, morphing interpolation handles sparse keyframes quite well.
         //  Simple animation cycles like this look ok with 10-15 frames instead of 100 ;)
         
         for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {
            skin.morphTargetInfluences[ i ] = 0;
         }
         
         skin.morphTargetInfluences[ Math.floor( t ) ] = 1;
         
         t += 1;
      }
         //render
         var timer = new Date().getTime() * 0.0005;
         
         camera.position.x = Math.cos( timer ) * 10;
         camera.position.y = 2;
         camera.position.z = Math.sin( timer ) * 10;
         
         particleLight.position.x = Math.sin( timer * 4 ) * 3009;
         particleLight.position.y = Math.cos( timer * 5 ) * 4000;
         particleLight.position.z = Math.cos( timer * 4 ) * 3009;
         
         pointLight.position.x = particleLight.position.x;
         pointLight.position.y = particleLight.position.y;
         pointLight.position.z = particleLight.position.z;
         
         renderer.render( scene, camera );
      
         
   }
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
   
   this.onMouseMoved		= function( x, y )
   {
      lastMouse.x = x;
      lastMouse.y = y;

	console.log(x+":"+y)
   }		
   
   this.onMousePressed	= function (x,y){
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

