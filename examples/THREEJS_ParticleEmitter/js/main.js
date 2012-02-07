// load graphics base, because this is a graphics app
LAB.require(LAB.src+"app/ThreeApp.js");
LAB.require(LAB.src+"three/Mesh.js");
LAB.require(LAB.src+"three/Shader.js");
LAB.require(LAB.src+"three/ParticleEmitter.js");

var demoApp;

$(document).ready( function() {
                  DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
                  demoApp = new DemoApp();
                  
                  demoApp.begin();
                  });

//TODO: 
/*
 
 */

// ===========================================
// ===== DEMO APP
// ===========================================

DemoApp = function() {
	LAB.app.ThreeApp.call( this );		
   
   var bStats =  true;
   var camera;
   var geo;
   var emitter;
   
   
   // ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
      //stats
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '10px';
      stats.domElement.style.left = '10px';
      this.container.appendChild( stats.domElement );
      stats.domElement.hidden = !bStats;
      
		// catch mouse events!
		this.registerMouseEvents();
      
      //camera
      camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight);
      camera.position.set( 0, 10, 30 );
      camera.lookAt( new THREE.Vector3(0, 0, 0) );
      this.scene.add( camera );
      
      //lights
      var pointLight = new THREE.PointLight( );
      pointLight.position = camera.position;
      this.scene.add( pointLight );
      
      //load some geometry
      geo = new LAB.three.Mesh();
      geo.load( "models/emitterGeometry.js", new THREE.MeshPhongMaterial() );
      
      //particle emitter
      emitter = new LAB.three.ParticleEmitter( { maxParticleCount: 10000 });
	}
   
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
      if(bStats) stats.update();
      
      geo.rotation.x += .005;
      geo.rotation.y += .0005;
      
      //update particles
      var currentTime = this.getElapsedTimeSeconds();
      for(var i=emitter.geometry.__webglParticleCount-1; i>=0; i--){
         p = emitter.particles[i];
         
         p.pos.addSelf( emitter.particles[i].vel );
         p.vel.multiplyScalar( .975 );//attenuation 
         p.vel.y += .001;
         
         if(currentTime > p.birth + p.lifespan){
            emitter.removeParticle( i );
         }
      }
      
      //emit some particles from the geometry onceit's loaded
      if(geo.isLoaded){
         for(var i=0; i<100; i++){
            var face = geo.geometry.faces[ LAB.randomInt( 0, geo.geometry.faces.length-1) ];//get random face
            var pos = geo.randomPointOnMesh( face );
            var vel = new THREE.Vector4(face.normal.x, face.normal.y, face.normal.z, 0 );
            vel.multiplyScalar( .125 );//use it's normal as our new particle's velocity
            geo.matrix.multiplyVector4( vel );//rotate the vel with the mesh's matrix
            
            emitter.addParticle(pos,
                                vel,
                                {x: LAB.random( .1, 1), y:LAB.random( .1, 1), z:LAB.random( .1, 1)},//color
                                LAB.random( 2, 4),//size
                                currentTime,//time
                                LAB.random( .5, 2 ));//lifespan
         }
      }
	}
   
   
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
      gl.clearColor( 1, 1, 1, 1 );
      this.renderer.render( this.scene, camera, null, true );
	}
   
   
	// ===========================================
	// ===== KEYS
	// ===========================================
   
   
   this.onDocumentKeyDown = function( event ){
//      console.log( event.keyCode );
      switch( event.keyCode ) {
         case 32:
            bStats = !bStats;
            stats.domElement.hidden = !bStats;
            break;
      }
   }
}
