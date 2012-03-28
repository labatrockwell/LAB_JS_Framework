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
      
      //load some geometry
      geo = new LAB.three.Mesh();
      console.log("here?");
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
