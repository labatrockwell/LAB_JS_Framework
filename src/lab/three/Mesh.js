/** @namespace LAB.three */
LAB.three = LAB.three || {};

/** 
 @constructor 
 @extends THREE.Geometry
 */

LAB.three.Mesh = function () {
   THREE.Mesh.call( this );
   
//   this.material = null;
   this.loader = new THREE.JSONLoader( true );

   this.isLoaded = true;
};

LAB.three.Mesh.prototype = new THREE.Mesh();
LAB.three.Mesh.prototype.constructor = LAB.three.Mesh;
LAB.three.Mesh.prototype.supr = THREE.Mesh.prototype;


/**
 @function
 @public
 */

LAB.three.Mesh.prototype.loadGeometry = function( location, onload ){

   this.isLoaded = false;

   var self = this;
   this.loader.onLoadComplete = onload || function(){};
   this.loader.load( location, function( geometry ){self.geometry = geometry;} );
}


LAB.three.Mesh.prototype.load = function( location, shader, scene){
   scene = scene || LAB.self.scene;
   this.material = shader || new THREE.NormalMaterial();
   var self = this;
   var onload = function(){
      self.isLoaded = true;
      
      self.geometry.computeBoundingSphere();
      self.boundRadius = self.geometry.boundingSphere.radius;
      scene.add( self );
      
      console.log( location," loaded" );
   }
   this.loadGeometry( location, onload );
}

LAB.three.Mesh.prototype.randomPointOnMesh = function( face ){
   if(this.isLoaded){
      var randFace = face || this.geometry.faces[ LAB.randomInt( 0, this.geometry.faces.length-1) ];
      var pos = THREE.GeometryUtils.randomPointInFace( randFace, this.geometry, true ); 
      this.matrixWorld.multiplyVector3( pos );
      
      return pos;
   }
   else return new THREE.Vector3();
}
