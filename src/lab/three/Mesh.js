/** @namespace LAB.three */
LAB.three = LAB.three || {};

/** 
 @constructor 
 @extends THREE.Mesh
 */

LAB.three.Mesh = function () {
  THREE.Mesh.call( this );
  
    //   this.material = null;
  this.loader = null;// new THREE.JSONLoader( true );
  this.isLoaded = false;
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
  this.loader = new THREE.JSONLoader( true );
  this.loader.onLoadComplete = onload || function(){};
  this.loader.load( location, function( geometry ){self.geometry = geometry;} );
}

LAB.three.Mesh.prototype.load = function( location, shader, scene ){
   this.scene = scene || console.warn("please pass in a THREE.Scene object");
   if (!scene){
      return;
      //this.scene = new THREE.Scene();
   }
   this.material = shader || new THREE.NormalMaterial();
   var self = this;
   var onload = function(){
      //      self.mesh = new THREE.Mesh( self.geometry, self.shader);
      
      self.geometry.computeBoundingSphere();
      self.boundRadius = self.geometry.boundingSphere.radius;
      this.scene.add( self );
      
      console.log( location," loaded" );
   }
   this.loadGeometry( location, onload );
}

