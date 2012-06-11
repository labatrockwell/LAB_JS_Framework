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
            this.registerMouseEvents()
            
            this.camera.position.z = 200;

            //make some geometry
            cube = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
            this.scene.add( cube );      
	}
   
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
            if(bStats) stats.update();
            
            cube.rotation.x += .01;
            cube.rotation.y += .005;
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
