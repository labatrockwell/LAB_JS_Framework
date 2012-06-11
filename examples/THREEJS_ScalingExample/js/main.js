var demoApp;

$(document).ready( function() {
   DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
   demoApp = new DemoApp();
   demoApp.begin({width:960, height:540}); //scaled to 1920x1080 in CSS
});

//TODO: 
/*
 
 */

var stairText = function( parameters ){
   parameters = parameters || {};
   
   this.txt = parameters.txt || "Hellow World, now let's walk up and down these monday through friday stairs "; 
   this.pos = parameters.pos || new THREE.Vector2( 0, 0 );
   this.ctx = parameters.ctx || canvas.getContext("2d");
   
   this.width = this.ctx.measureText(this.txt).width;
   this.wrapPad = parameters.wrapPad || 60;
   
   this.dir = parameters.dir || new THREE.Vector2( -1, 0 );
   this.col = parameters.col || {r: 255, g: 255, b: 255};

   this.changeText = function(newTxt){
      this.txt = newTxt;
      this.width = this.ctx.measureText(this.txt).width;
   }
   
   this.draw = function( directionOverride ){
      
      this.pos.addSelf( directionOverride || this.dir );
      if(this.pos.x <= -this.width - this.wrapPad){
         this.pos.x = 0;
      }
      else if( this.pos.x >= this.wrapPad ){
         this.pos.x -= this.width + this.wrapPad;
      }
      this.ctx.fillStyle = 'rgba('+this.col.r+','+this.col.g+','+this.col.b+',255)';//'+this.color.r+','+this.color.g+','+','+this.color.b+', 255)';
      this.ctx.fillText( this.txt, this.pos.x, this.pos.y );
      this.ctx.fillText(this.txt,
                        this.pos.x + this.width + this.wrapPad,
                        this.pos.y );
   }
};

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
      
		// catch mouse events!
		this.registerMouseEvents();
      
      //camera
      camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight);
      camera.position.set( 0, 150, 200 );
      camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
      this.scene.add( camera );
      
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
      gl.clearColor( .3, .3, .33, 0 );
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
