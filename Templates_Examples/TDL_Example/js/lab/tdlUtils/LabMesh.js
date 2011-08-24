/*••••••••
 •••LAB•••
 ••••••••*/

LabMesh = function () {
   
   this.indices, 
   this.vertices = null,
   this.normals = null, 
   this.texCoords = null,
	this.colors = null;
   
   this.posBuffer,
   this.normBuffer = null,
   this.texCoordBuffer = null,
   this.colorBuffer = null,
   this.indexBuffer = null,
   
   this.mBuffers = [],
   this.boundBool = false,
   
   this.renderType = GL.TRIANGLES ;
};

LabMesh.prototype = {
   //BUFFERS, ATTRIBUTES, BINDING, DRAWING, SHADER
   /********************************************************************
    TO DO: add a generic function function for adding custume attributes
    *******************************************************************/
   setRenderType : function (rType){
     this.renderType = rType;
   },
   
   addVerts : function ( verts ) {
      if( !this.vertices ){
            this.vertices = verts.slice();
      }else{
         for( var i=0; i<verts.size(); i++){
            this.vertices.push( verts[i] );
         }
      }
//      if( !this.renderType ){
//         this.renderType = GL.TRIANGLES ; // this.setRenderType( GL.TRIANGLES );//<-default
//      }
   },
   
   addNorms : function ( norms ) {
      if( !this.normals ){
         this.normals = norms.slice();
      }else{
         for( var i=0; i<norms.length; i++){
            this.normals.push( norms[i] );
         }
      }
   },
   
   addTexCoords : function ( tc ) {
      if( !this.texCoords ){
         this.texCoords = tc.slice();
      }else{
         for(var i=0; i<tc.length; i++){
            this.texCoords.push( tc[i] );
         }
      }
   },
   addIndices : function ( _indices ) {
      this.indices = _indices.slice();
   },
   
	addColors : function ( _colors ){
	    this.colors = _colors.slice();
	},

   addVertex : function ( _vert ){
      this.vertices.push( _vert );
   },
   addNormal : function ( _norm ){
      this.normals.push( _norm );
   },
   addTexCoord : function ( _tex ){
      this.texCoords.push( _tex );
   },
   addColor : function ( _c ){
      this.colors.push( _c );
   },
   addIndex : function ( _index ){
      this.indices.push( _index );
   },
   
   //http://www.openGL.org/wiki/Buffer_Object
   createBuffers : function()
   {  
      if( this.vertices ){
         this.posBuffer = this.createFloatBuffer( this.vertices, 3, 'posAttr' );
         this.mBuffers.push( this.posBuffer );
      }
      if( this.normals ){
         this.normBuffer = this.createFloatBuffer( this.normals, 3, 'normAttr' );
         this.mBuffers.push( this.normBuffer );
      }
      if( this.texCoords ){
         this.texCoordBuffer = this.createFloatBuffer( this.texCoords, 2, 'texCoordAttr' );
         this.mBuffers.push( this.texCoordBuffer );
      }

      if( this.colors ){
         this.colorBuffer = this.createFloatBuffer( this.colors, 4, 'colorAttr' );
         this.mBuffers.push( this.colorBuffer );
      }

      //handle indices differently from vertex attributes
      this.indexBuffer = this.createIndexBuffer( this.indices, 1 );
   },
   
   addBuffer : function(_shader, dataArray, itemSize, attrName){
      var buffer = GL.createBuffer();
      GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
      
      GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(dataArray), GL.DYNAMIC_DRAW);
      
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      buffer.shaderAttr = attrName;
      buffer.attrLoc = GL.getAttribLocation( _shader.program, attrName);
      if( buffer.attrLoc !== -1 ){
         this.mBuffers.push( buffer );
         return buffer;
      }else{
         labLog( "CHECK attribute named: " + attrName + "\n we couldn't find it in shader");
         return null;
      }
   },
   
   addIndexBuffer : function( indexArray ){
      this.indexBuffer = GL.createBuffer();
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), GL.DYNAMIC_DRAW);
      this.indexBuffer.itemSize = 1;
      this.indexBuffer.numItems = indexArray.length;// / itemSize;
      return this.indexBuffer;
   },
   
   bind : function (){
      if( !currentShader ){
         Log( "no current shader. use shader.begin() first" );
      }else{
         //attributes
         for( var i=0; i<this.mBuffers.length; i++) {
            GL.bindBuffer( GL.ARRAY_BUFFER, this.mBuffers[i] );
            GL.vertexAttribPointer(this.mBuffers[i].attrLoc, this.mBuffers[i].itemSize, GL.FLOAT, false, 0, 0);
         }
         //indices
         if(this.indexBuffer){
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer); 
         }
      }
   },
   
   draw : function (opt_start, opt_count){ 
      if( !this.boundBool ){
         if(currentMesh){
            currentMesh.boundBool = null;
         } this.bind();
         
         //this.boundBool = true;
         currentMesh = this;
      }
      //if(this.indexBuffer ){
         var count = opt_count || this.indexBuffer.numItems;
         var start = opt_start || 0;
         GL.drawElements( this.renderType, count, GL.UNSIGNED_SHORT,  start);
      //}
      //else{
      //   GL.drawArrays( 
      //}
   },
   
   createFloatBuffer : function (dataArray, itemSize, attrName){
      var buffer = GL.createBuffer();
      GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
      
      GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(dataArray), GL.DYNAMIC_DRAW);
      
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      buffer.shaderAttr = attrName;
      buffer.attrLoc = 0;
      return buffer;
   },
   
   createIndexBuffer : function (dataArray, itemSize){
      var buffer = GL.createBuffer();
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
      
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(dataArray), GL.DYNAMIC_DRAW);
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      return buffer;
   },

   updateBuffer : function( _buffer, _data ){
      //http://stackoverflow.com/questions/5497722/how-can-i-animate-an-object-in-webgl-modify-specific-vertices-not-full-transform
      GL.bindBuffer(GL.ARRAY_BUFFER, _buffer );
      GL.bufferSubData( GL.ARRAY_BUFFER, 0, new Float32Array( _data) );
   },
};