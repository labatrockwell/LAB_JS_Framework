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
  this.loader.onLoadComplete = onload || function(){};
  this.loader.load( location, function( geometry ){self.geometry = geometry;} );
}


  //LAB.three.Mesh.prototype.loadCollada = function( location, scene){
  //   scene = scene || LAB.self.scene;
  //   
  //   var self = this;
  //   var dae = null;
  //   this.loader = new THREE.ColladaLoader();
  //   this.loader.load( location, function colladaReady( collada ){
  //               dae = collada.scene;
  //               scene.add( dae );
  //               console.log( location," loaded" );
  //   } );
  //   return dae;
  //}

LAB.three.Mesh.prototype.load = function( location, shader, scene, callback ){
  scene = scene || LAB.self.scene;
  this.material = shader || new THREE.MeshNormalMaterial();
  var self = this;
  this.loader = new THREE.JSONLoader( true );
  callback = callback || function(){};
  var onload = function(){
    self.geometry.computeBoundingBox();
    self.geometry.computeBoundingSphere();
    self.boundRadius = self.geometry.boundingSphere.radius;
    scene.add( self );
    self.isLoaded = true;
    callback(  self.geometry  );
    console.log( location," loaded" );
  }
  this.loadGeometry( location, onload );
}
