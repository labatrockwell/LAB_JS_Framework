/*
 extends THREE.Geometry() to create and load geometry
*/


LabThreeGeometry = function () {
   THREE.Geometry.call( this );// I think this works, seems to work...
      
   //this.whatever
};

LabThreeGeometry.prototype = new THREE.Geometry();
LabThreeGeometry.prototype.constructor = LabThreeGeometry;
LabThreeGeometry.prototype.supr = THREE.Geometry.prototype;


LabThreeGeometry.prototype.addVertex = function( x,y,z){
   
   this.vertices.push( new THREE.Vertex( new THREE.Vector3(x,y,z)));
   return this.vertices.length - 1;
};

LabThreeGeometry.prototype.addFace = function( i0, i1, i2 ){
   this.faces.push( new THREE.Face3( i0, i1, i2 ) );
   return this.faces.length - 1;
};

LabThreeGeometry.prototype.update = function(){
   this.__dirtyVertices = true;
};

LabThreeGeometry.prototype.calcuateNormalsSmooth = function(){
   this.computeFaceNormals();
   this.computeVertexNormals();
};
LabThreeGeometry.prototype.calcuateNormalsFaceted = function(){
   this.computeFaceNormals();
};
