/** @namespace LAB.tdl */
LAB.tdl = LAB.tdl || {};

/** @constructor */
LAB.tdl.Shader = function () {
   
	this.program;
   this.attributes = [];
   this.uniforms = [];
   this.pMatrixUniform;
   this.mvMatrixUniform;
   this.normMatrixUniform;
};

LAB.tdl.Shader.prototype = {
   
	setup : function ( vertexShaderID, fragmentShaderID ) {
      
		var vertexShader = this.getShader( vertexShaderID );
		var fragmentShader = this.getShader( fragmentShaderID );
      
		this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);
      
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
         alert("Could not initialise shaders");
      }
      
      gl.useProgram(this.program);
      
      //add typical attributes(if they exist). might be confusing down the road....
      this.addAttriubte("aColor");
      this.addAttriubte("aPosition");
      this.addAttriubte("aNormal");
      this.addAttriubte("aTexCoord");
      
      this.pMatrixUniform = this.addUniform( "projectionMatrix" );
      this.mvMatrixUniform = this.addUniform( "modelviewMatrix" );
      
      gl.useProgram(null);      
	},
   
	getShader : function ( id ) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
         return null;
      }
      
      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
         if (k.nodeType == 3) {
            str += k.textContent;
         }
         k = k.nextSibling;
      }
      
      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
         shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
         shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
         return null;
      }
      
      gl.shaderSource(shader, str);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
         alert(gl.getShaderInfoLog(shader));
         return null;
      }
      
      return shader;
	},
   
   begin : function (){
      //Log( "shader begin" );
      gl.useProgram(this.program);
      currentShader = this;
      for( var i=0; i<this.attributes.length; i++){
            gl.enableVertexAttribArray( this.attributes[i] );            
      }
      this.setMatrixUniforms();
      
      //unbind currentmesh. this updates the attributes passed to the shader
//      if(currentMesh){
//         currentMesh.boundBool = false;
//      }
   },
   
   end : function (){
      currentShader = null;
      gl.useProgram(null);
   },
   
   addAttriubte : function ( attrname ){
      var attrloc = gl.getAttribLocation(this.program, attrname); 
      if(attrloc !== -1){
         this.attributes.push( attrloc );

      }else{
         labLog( "no attribute named " + attrname +" in this shader" );
      }
      return attrloc;      
   },
   
   addAttribute : function ( attrname ){
      var attrloc = gl.getAttribLocation(this.program, attrname); 
      if(attrloc !== -1){
         this.attributes.push( attrloc );

      }else{
         labLog( "no attribute named " + attrname +" in this shader" );
      }
      return attrloc;      
   },
   
   addUniform : function ( uniformname ){
      var uniloc = gl.getUniformLocation( this.program, uniformname );
      if(uniloc != -1){
         uniloc.name = uniformname;
         this.uniforms.push( uniloc );
         return uniloc;
      }else{
         //no uniform of that name
         return uniloc;//null;
      }
   },
   
   //set uniforms.
   //I know this is slowed by the gl.get calls but for convenience it's like this
   //should change in the the fututre
   setUniform1f : function ( uniformName, v1){
      gl.uniform1f(gl.getUniformLocation( this.program, uniformName), v1 );
   },
   setUniform2f : function ( uniformName, v1, v2){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform3f : function (  uniformName, v1, v2, v3){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform4f : function (  uniformName, v1, v2, v3, v4){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3, v4);
   },
   
   
   setUniform1fv : function (  uniformName, v ){
      gl.uniform1fv(gl.getUniformLocation( this.program, uniformName), v );
   },
   setUniform2fv : function (  uniformName, v ){
      gl.uniform2fv(gl.getUniformLocation( this.program, uniformName), v);
   },
   setUniform3fv : function (  uniformName, v ){
      gl.uniform3fv(gl.getUniformLocation( this.program, uniformName), v);
   },
   
   setUniform1i : function (  uniformName, v1){
      gl.uniform1f(gl.getUniformLocation( this.program, uniformName), v1 );
   },
   setUniform2i : function (  uniformName, v1, v2){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform3i : function (  uniformName, v1, v2, v3){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform4i : function (  uniformName, v1, v2, v3, v4){
      gl.uniform3f(gl.getUniformLocation( this.program, uniformName), v1, v2, v3, v4);
   },
   
   setUniformTexture : function ( tex, uniformName, loc ){
      gl.uniform1i(gl.getUniformLocation(this.program, uniformName), loc);

      gl.activeTexture(gl.TEXTURE0 + loc);    
      gl.bindTexture(gl.TEXTURE_2D, tex.texture);
      gl.activeTexture(gl.TEXTURE0);
   },
   
   setMatrixUniforms : function () {
      gl.uniformMatrix4fv( this.mvMatrixUniform, false, modelviewMatrix );
      gl.uniformMatrix4fv( this.pMatrixUniform, false, projectionMatrix );
   },
   
};
