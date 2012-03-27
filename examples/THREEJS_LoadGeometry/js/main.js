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
            
            //camera
            camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight);
            camera.position.set( 0, 20, 50 );
            camera.lookAt( new THREE.Vector3(0, 0, 0) );
            this.scene.add( camera );

            //load some geometry
            geo = new LAB.three.Mesh();
            geo.load( "models/exampleGeometry.js", new THREE.MeshNormalMaterial(), this.scene );
            
	}
   
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
            if(bStats) stats.update();
      
            geo.rotation.x += .01;
            geo.rotation.y += .005;

	}
   
   
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
//      gl.clearColor( .3, .3, .33, 1 );
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
