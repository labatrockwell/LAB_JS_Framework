/** @namespace LAB.tdl */
LAB.tdl = LAB.tdl || {};

/** @constructor */
LAB.tdl.Mesh = function () {
   
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
   
   this.renderType = gl.TRIANglES;
};

LAB.tdl.Mesh.prototype = {
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
//         this.renderType = gl.TRIANglES ; // this.setRenderType( gl.TRIANglES );//<-default
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
   
   //http://www.opengl.org/wiki/Buffer_Object
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
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArray), gl.DYNAMIC_DRAW);
      
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      buffer.shaderAttr = attrName;
      buffer.attrLoc = gl.getAttribLocation( _shader.program, attrName);
      if( buffer.attrLoc !== -1 ){
         this.mBuffers.push( buffer );
         return buffer;
      }else{
         labLog( "CHECK attribute named: " + attrName + "\n we couldn't find it in shader");
         return null;
      }
   },
   
   addIndexBuffer : function( indexArray ){
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.DYNAMIC_DRAW);
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
            gl.bindBuffer( gl.ARRAY_BUFFER, this.mBuffers[i] );
            gl.vertexAttribPointer(this.mBuffers[i].attrLoc, this.mBuffers[i].itemSize, gl.FLOAT, false, 0, 0);
         }
         //indices
         if(this.indexBuffer){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); 
         }
      }
   },
   
   draw : function (opt_start, opt_count){ 
      if( !this.boundBool ){
         if(LAB.tdl.currentMesh){
            LAB.tdl.currentMesh.boundBool = null;
         } this.bind();
         
         //this.boundBool = true;
         LAB.tdl.currentMesh = this;
      }
	//console.log(this.indexBuffer.numItems);
      //if(this.indexBuffer ){
         var count = opt_count || this.indexBuffer.numItems;
         var start = opt_start || 0;
         gl.drawElements( this.renderType, count, gl.UNSIGNED_SHORT,  start);
      //}
      //else{
      //   gl.drawArrays( 
      //}
   },
   
   createFloatBuffer : function (dataArray, itemSize, attrName){
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArray), gl.DYNAMIC_DRAW);
      
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      buffer.shaderAttr = attrName;
      buffer.attrLoc = 0;
      return buffer;
   },
   
   createIndexBuffer : function (dataArray, itemSize){
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dataArray), gl.DYNAMIC_DRAW);
      buffer.itemSize = itemSize;
      buffer.numItems = dataArray.length / itemSize;
      return buffer;
   },

   updateBuffer : function( _buffer, _data ){
      //http://stackoverflow.com/questions/5497722/how-can-i-animate-an-object-in-webgl-modify-specific-vertices-not-full-transform
      gl.bindBuffer(gl.ARRAY_BUFFER, _buffer );
      gl.bufferSubData( gl.ARRAY_BUFFER, 0, new Float32Array( _data) );
   },

	updateIndexBuffer : function( _data ){
      //http://stackoverflow.com/questions/5497722/how-can-i-animate-an-object-in-webgl-modify-specific-vertices-not-full-transform
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
      gl.bufferSubData( gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array( _data) );
      //this.indexBuffer.numItems = _data.length;
   },

	deleteBuffer : function( _buffer ){
		gl.deleteBuffer(_buffer);
	}
};