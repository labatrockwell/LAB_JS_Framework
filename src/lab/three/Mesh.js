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
<<<<<<< HEAD
   this.isLoaded = true;
=======
>>>>>>> 118c893d3fa4f708122d43f1fdd7ad349b0f9445
};

LAB.three.Mesh.prototype = new THREE.Mesh();
LAB.three.Mesh.prototype.constructor = LAB.three.Mesh;
LAB.three.Mesh.prototype.supr = THREE.Mesh.prototype;


/**
 @function
 @public
 */

LAB.three.Mesh.prototype.loadGeometry = function( location, onload ){
<<<<<<< HEAD
   this.isLoaded = false;
=======
>>>>>>> 118c893d3fa4f708122d43f1fdd7ad349b0f9445
   var self = this;
   this.loader.onLoadComplete = onload || function(){};
   this.loader.load( location, function( geometry ){self.geometry = geometry;} );
}


LAB.three.Mesh.prototype.load = function( location, shader, scene){
   scene = scene || LAB.self.scene;
   this.material = shader || new THREE.NormalMaterial();
   var self = this;
   var onload = function(){
<<<<<<< HEAD
      self.isLoaded = true;
=======
>>>>>>> 118c893d3fa4f708122d43f1fdd7ad349b0f9445
      //      self.mesh = new THREE.Mesh( self.geometry, self.shader);
      
      self.geometry.computeBoundingSphere();
      self.boundRadius = self.geometry.boundingSphere.radius;
      scene.add( self );
      
      console.log( location," loaded" );
   }
   this.loadGeometry( location, onload );
}
<<<<<<< HEAD

LAB.three.Mesh.prototype.randomPointOnMesh = function( face ){
   if(this.isLoaded){
      var randFace = face || this.geometry.faces[ LAB.randomInt( 0, this.geometry.faces.length-1) ];
      var pos = THREE.GeometryUtils.randomPointInFace( randFace, this.geometry, true ); 
      this.matrixWorld.multiplyVector3( pos );
      
      return pos;
   }
   else return new THREE.Vector3();
}
=======
>>>>>>> 118c893d3fa4f708122d43f1fdd7ad349b0f9445
