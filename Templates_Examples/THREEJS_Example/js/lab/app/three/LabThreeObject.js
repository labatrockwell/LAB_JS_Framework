/*
 lars berg
 */

LabThreeObject = function( _renderer, _scene ) {
   
   this.renderer = _renderer;
   this.scene = _scene || new THREE.Scene();;
   this.autoClear = false;
   this.labObj = new THREE.Object3D();
   
   //this isn't great. temporary stop gap
   this.posStack = [];
   this.rotStack = [];
   this.sclStack = [];
   
   this.scene.addObject( this.labObj );
};


LabThreeObject.prototype = {
   
constructor: LabThreeObject,

addGeometry: function( _geometry, _material){
   this.labObj.addChild( new THREE.Mesh( _geometry, _material  ) );
},

addObject: function( _object ){
   this.labObj.addChild( _object );
},
addChild: function( _child ){
   this.labObj.addChild( _child );
},
   
addLight: function( _light ){
   this.scene.addLight( _light );
},
   
draw: function( _camera, _material, _renderTarget )
{   
   this.scene.overrideMaterial = _material || null;
   this.renderer.render(this.scene, 
                        _camera,
                        _renderTarget,
                        this.autoClear );
},
   
translate: function( x,y,z ){
   this.labObj.position.x += x;
   this.labObj.position.y += y;
   this.labObj.position.z += z;
},
   
setTranslation: function( x,y,z ){
   this.labObj.position.x = x;
   this.labObj.position.y = y;
   this.labObj.position.z = z;
},
   
//rotate: function(angle, x,y,z ){
//   var rotMat = new THREE.Matrix4().setRotationAxis( new THREE.Vector3(x,y,z), angle * 0.0174532925 );
//   var rotVec = new THREE.Vector3();
//   rotVec.setRotationFromMatrix( rotMat );
//   this.labObj.rotation.addSelf( rotVec );
//},
   
setRotation: function( angle, x,y,z ){
   var rotMat = new THREE.Matrix4().setRotationAxis( new THREE.Vector3(x,y,z).normalize(), angle * 0.0174532925 );
   
   this.labObj.rotation.setRotationFromMatrix( rotMat );
},
   
   
scale: function( x, y, z){
   this.labObj.scale.set(this.labObj.scale.x * x,
                       this.labObj.scale.y * y,
                       this.labObj.scale.z * z);
},
setScale: function( x, y, z){
   this.labObj.scale.set( x, y, z );
},
   
multMatrix: function( m ){
  //TODO: we might need to make this an extension of THREE.Object3D so that we can override updateMatrix() which is called by the render  er
},
   
pushMatrix: function(){
   this.posStack.push( this.labObj.position );
   this.rotStack.push( this.labObj.rotation );
   this.sclStack.push( this.labObj.scale );
},
   
popMatrix: function(){
   if( this.posStack.length ){
   this.labObj.position.copy( this.posStack.pop() );
   this.labObj.rotation.copy( this.rotStack.pop() );
   this.labObj.scale.copy( this.sclStack.pop() );
   }
},
      
};
