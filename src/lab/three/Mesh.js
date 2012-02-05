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
};

LAB.three.Mesh.prototype = new THREE.Mesh();
LAB.three.Mesh.prototype.constructor = LAB.three.Mesh;
LAB.three.Mesh.prototype.supr = THREE.Mesh.prototype;


/**
 @function
 @public
 */

LAB.three.Mesh.prototype.loadGeometry = function( location, onload ){
   var self = this;
   this.loader.onLoadComplete = onload || function(){};
   this.loader.load( location, function( geometry ){self.geometry = geometry;} );
}


LAB.three.Mesh.prototype.load = function( location, shader, scene){
   scene = scene || LAB.self.scene;
   this.material = shader || new THREE.NormalMaterial();
   var self = this;
   var onload = function(){
      //      self.mesh = new THREE.Mesh( self.geometry, self.shader);
      
      self.geometry.computeBoundingSphere();
      self.boundRadius = self.geometry.boundingSphere.radius;
      scene.add( self );
      
      console.log( location," loaded" );
   }
   this.loadGeometry( location, onload );
}
