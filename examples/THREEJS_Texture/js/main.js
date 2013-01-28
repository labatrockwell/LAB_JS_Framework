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
   
   var bStats =  true;
   var camera;
   var cube;
   var tex;

   // ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
      // customize the built-in camera
      this.camera.position.z = 200;
      var tex = THREE.ImageUtils.loadTexture("img/jar.jpeg");

      //make some geometry
      cube = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshBasicMaterial({map:tex}) );
      this.scene.add( cube );      
	}
   
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
      cube.rotation.x += .01;
      cube.rotation.y += .005;
	}  
   
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
      // you must call this in draw!
      this.renderer.render( this.scene, this.camera, null, true );
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
