/** @namespace LAB.three */
LAB.three = LAB.three || {};

/** 
	@constructor 
	@extends THREE.Geometry
*/

LAB.three.Geometry = function () {
   THREE.Geometry.call( this );// I think this works, seems to work...
      
   //this.whatever
};

LAB.three.Geometry.prototype = new THREE.Geometry();
LAB.three.Geometry.prototype.constructor = LAB.three.Geometry;
LAB.three.Geometry.prototype.supr = THREE.Geometry.prototype;


LAB.three.Geometry.prototype.addVertex = function( x,y,z){
   
   this.vertices.push( new THREE.Vertex( new THREE.Vector3(x,y,z)));
   return this.vertices.length - 1;
};

LAB.three.Geometry.prototype.addFace = function( i0, i1, i2 ){
   this.faces.push( new THREE.Face3( i0, i1, i2 ) );
   return this.faces.length - 1;
};

LAB.three.Geometry.prototype.update = function(){
   this.__dirtyVertices = true;
};

LAB.three.Geometry.prototype.calcuateNormalsSmooth = function(){
   this.computeFaceNormals();
   this.computeVertexNormals();
};
LAB.three.Geometry.prototype.calcuateNormalsFaceted = function(){
   this.computeFaceNormals();
};
