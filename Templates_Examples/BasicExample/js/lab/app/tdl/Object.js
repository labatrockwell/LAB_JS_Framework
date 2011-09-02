/** @namespace LAB.tdl */
LAB.tdl = LAB.tdl || {};

/** @constructor */
LAB.tdl.Object = function () {
   
   /*************************************************************
    TODO:  seperate translate, scale, and rotate matrices????????
    *************************************************************/
   this.transformationMatrix = tdl.fast.identity4( new Float32Array(16) ); 
   this.children = [];
   this.pos =  new Float32Array(3);
   this.scl =  new Float32Array(3);
};

LAB.tdl.Object.prototype = {
   
   addChild : function( child ){
      this.children.push( child );
   },
   
   /*************************************************************
    TODO:  pass transform matrix to the shader as a third matrix. 
    that way we can do matrx math in update & improve performance
    *************************************************************/
   draw : function(){
      labPushMatrix();
      labMatrixMult( this.transformationMatrix );
      
      for(var i=0; i<this.children.length; i++){
         this.children[i].draw();
      }
      
      labPopMatrix();
   },
   
   

   move : function(x, y, z){
      fast.matrix4.translate( this.transformationMatrix, [x, y, z] );
   },
   
   scale : function ( x, y, z ){
      this.scl[0] = x, this.scl[1] = y, this.scl[2] = z;//<incorrect
      fast.matrix4.scale( this.transformationMatrix, [x, y, z] );
   },
   
   rotate : function ( angle, x, y, z){
      fast.matrix4.axisRotate( this.transformationMatrix, [x, y, z], angle );
   },
//   lookAt : function ( _target, _up)
//   {
//      this.getPosition;
//      var rotMat = tdl.math.matrix4.lookAt(this.pos, _target, _up);
//      //fast.matrix4.setTranslation(rotMat, [0,0,0]);
//      fast.identity4( this.transformationMatrix );
//      this.move( this.pos[0], this.pos[1], this.pos[2] );
//      this.scale( this.scl[0], this.scl[1], this.scl[2]);
//      fast.matrix4.mul( this.transformationMatrix, this.transformationMatrix, rotMat);
//   },

   getPosition : function(){
      fast.matrix4.getTranslation( this.pos, this.transformationMatrix );
      return this.pos;
   },
   getScale : function(){
      return this.scl;
   },
};