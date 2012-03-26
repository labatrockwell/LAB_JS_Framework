// load graphics base, because this is a graphics app
LAB.require(LAB.src+"app/ThreeApp.js");

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
   
   var bStats = false;// true; //
   
   var orthocamera;
   
   var canvas, context, streetTexture, textRenderTarget;
   var svRenderTarget, svScn;
   
   var stairFaces, stairs;
   var camera;
   var controls;
   var mesh, container;
   
   var rotVel = {x:0, y:0};
	var lastMouse = {x:0, y:0};
   var camRot = {x:0, y:0};
   var camPos = new THREE.Vector3();
   var camTarget = new THREE.Vector3();
   
   var zoom = 3;
   
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
      
      canvas = document.createElement( 'canvas' );
      canvas.width = Math.pow( 2, zoom) * 416;
      canvas.height = Math.pow( 2, zoom-1 ) * 516;
      context = canvas.getContext("2d");
      
      streetTexture = new THREE.Texture( canvas, null, true, true );
      streetTexture.needsUpdate = true;
      
      var faces = 20;
      mesh = new THREE.Mesh( new THREE.SphereGeometry( 500,40,20 ), new THREE.MeshBasicMaterial( { wireframe: false, map: streetTexture } ) );
      mesh.doubleSided = true;
      mesh.scale.set( -1, 1, 1);
      this.scene.add( mesh );
      
      //http://www.clicktorelease.com/code/street/ 
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': "5 south west Union Square"}, function(results, status) {
                       if (status == google.maps.GeocoderStatus.OK) {
                       loadPanorama( results[0].geometry.location );
                       } else {
                       console.log("Geocode was not successful for the following reason: " + status);
                       }
                       });
      
      
      //3D scene
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1100 );
      this.scene.add( camera );
	}
   
   function loadPanorama( location ) {
      //http://www.clicktorelease.com/code/street/ 
      activeLocation = location;
      copyright = '';
      
      panoramas = [];
      
      var panoClient = new google.maps.StreetViewService();
      panoClient.getPanoramaByLocation( location, 50, function( result, status ) {
                                       if (status == google.maps.StreetViewStatus.OK) {
                                       var h = google.maps.geometry.spherical.computeHeading( location, result.location.latLng );
                                       mesh.rotation.y = ( result.tiles.centerHeading - h ) * Math.PI / 180.0;
                                       copyright = result.copyright;
                                       composePanorama( result.location.pano, zoom );
                                       } else {					
                                       console.log("Could not retrieve panorama for the following reason: " + status);
                                       }
                                       } );
      
   }
   
   function composeFromTile( x, y, texture ) {

      context.drawImage(texture.image, x * 512, y * 512 );
      streetTexture.needsUpdate = true;
      
   }
   
   var count = 0;
   var total = 0;
   var queue = [];
   
   function composePanorama( id, zoom ) {

      queue = [];
      
      // 512 x 512
      var w = Math.pow( 2, zoom );
      var h = Math.pow( 2, zoom - 1 );
      
      for( var y = 0; y < h; y++ ) {
         for( var x = 0; x < w; x++ ) {
            var url = 'http://maps.google.com/cbk?output=tile&panoid=' + id + '&zoom=' + zoom + '&x=' + x + '&y=' + y;
            ( function( x, y ) { 
             var texture = THREE.ImageUtils.loadTexture( url, null, function() {
                                                        composeFromTile( x, y, texture );
                                                        } );
             } )( x, y );
         }
      }
      
   }
   
   
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
      if(bStats) stats.update();
      
      camPos.multiplyScalar( .95 );
      camRot.x += rotVel.x;
      camRot.y += rotVel.y;
      rotVel.x *= .9;
      rotVel.y *= .9;
      camTarget.set(Math.cos( camRot.y  ) * Math.sin( camRot.x ) * 1000 + camera.position.x,
                    Math.sin( -camRot.y ) * 1000 + camera.position.y,
                    Math.cos( camRot.y ) * -Math.cos( camRot.x ) * 1000 + camera.position.z);
      camera.lookAt( camTarget );
      
      camera.position.addSelf( camPos );//copy( camera.position );
      camera.lookAt( camTarget );
	}
   
   
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
      gl.clearColor( .21,.21,.23,1 );
      
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
   
	this.onMouseMoved = function( x, y ) {
		lastMouse.x = x;
		lastMouse.y = y;
	}
   
   this.onMouseDragged	= function (x,y){
      console.log("wtf");
      rotVel.x += (x - lastMouse.x) * .001;
      rotVel.y += (y - lastMouse.y) * .0005;
      lastMouse.x = x;
      lastMouse.y = y;
   }
}
