/** @namespace LAB.tdl */
LAB.tdl = LAB.tdl || {};

/** @constructor */

var LabVertexAttribute = function(){
   this.name = null;
   this.loc = null;
   this.buffer = null;
   this.data = null;
   this.type = gl.FLOAT;
   this.size = this.count = this.stride = this.bufferSize = 0;
   this.loc = null;
   this.drawType = gl.DYNAMIC_DRAW;
};

LAB.tdl.LabVbo = function () {
   //vars
   this.attributes = []; //    vector <LabVertexAttribute> attributes;
   
   //methods
   this.clear = function(){
      for(var i=0; i<this.attributes.length; i++){
         gl.deleteBuffer( this.attributes[i].buffer ); 
      }
   };
   
   this.addAttribute = function( parameters ){
      parameters = parameters || {};
      var attr = new LabVertexAttribute();
      attr.name = parameters.name;
      attr.data = parameters.data || [] ;
      attr.type = parameters.type || gl.FLOAT;
      attr.size = parameters.size || 3;
      attr.count = attr.data.length / attr.size ;
      attr.loc = null;
      
      attr.drawType = parameters.drawType || gl.DYNAMIC_DRAW;
      attr.buffer = gl.createBuffer();
      
      //add data to buffer
      gl.bindBuffer( gl.ARRAY_BUFFER, attr.buffer );
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( attr.data ), attr.drawType );
      
      this.attributes.push( attr );
//      console.log( "adding an attribute named " + attr.name );
   }
   
   this.setAttribute = function( name, data, start ){
      var a = null;
      for(var i=0; i<this.attributes.length; i++){
         if( name = this.attributes[i].name){
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes[i].buffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, start, new Float32Array( data ) );
            return;
         }
      }
   };
   
   
   this.draw = function( mode, first, count ){
      var currentBuffer = 0;
      currentShader = gl.getParameter( gl.CURRENT_PROGRAM );
      var a = this.attributes;
      for( var i=0; i<a.length; i++){
         a[i].loc = gl.getAttribLocation( currentShader, a[i].name );
         if( a[i].loc >= 0 ){
            gl.enableVertexAttribArray( a[i].loc );
            gl.bindBuffer( gl.ARRAY_BUFFER, a[i].buffer );
            gl.vertexAttribPointer( a[i].loc, a[i].size, a[i].type, false, 0, 0);// void vertexAttribPointer(GLuint indx, GLint size, GLenum type, GLboolean normalized, GLsizei stride, GLintptr offset);
         }
         else{
//            console.log( "no attribute named ", a[i].name, " in shader. ")
         }
      }
      
      gl.drawArrays( mode || gl.TRIANGLES, first || 0, count || a[0].count ); // this could be improved a[0].count<--- what if there are different counts between attributes???
      
      for(var i=0; i<a.length; i++){
         gl.disableVertexAttribArray( a[i].loc);//???IS THIS NECESSARY
      }
      gl.bindBuffer( gl.ARRAY_BUFFER, null );
   };
};