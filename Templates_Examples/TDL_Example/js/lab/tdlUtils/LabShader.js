/*••••••••
 •••LAB•••
 ••••••••*/

LabShader = function () {
   
	this.program;
   this.attributes = [];
   this.uniforms = [];
   this.pMatrixUniform;
   this.mvMatrixUniform;
   this.normMatrixUniform;
};

LabShader.prototype = {
   
	setup : function ( vertexShaderID, fragmentShaderID ) {
      
		var vertexShader = this.getShader( vertexShaderID );
		var fragmentShader = this.getShader( fragmentShaderID );
      
      this.program = GL.createProgram();
      GL.attachShader(this.program, vertexShader);
      GL.attachShader(this.program, fragmentShader);
      GL.linkProgram(this.program);
      
      if (!GL.getProgramParameter(this.program, GL.LINK_STATUS)) {
         alert("Could not initialise shaders");
      }
      
      GL.useProgram(this.program);
      
      //add typical attributes(if they exist). might be confusing down the road....
      this.addAttriubte("aPosition");
      this.addAttriubte("aNormal");
      this.addAttriubte("aTexCoord");
      
      this.pMatrixUniform = this.addUniform( "projectionMatrix" );
      this.mvMatrixUniform = this.addUniform( "modelviewMatrix" );
      
      GL.useProgram(null);      
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
         shader = GL.createShader(GL.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
         shader = GL.createShader(GL.VERTEX_SHADER);
      } else {
         return null;
      }
      
      GL.shaderSource(shader, str);
      GL.compileShader(shader);
      
      if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
         alert(GL.getShaderInfoLog(shader));
         return null;
      }
      
      return shader;
	},
   
   begin : function (){
      //Log( "shader begin" );
      GL.useProgram(this.program);
      currentShader = this;
      for( var i=0; i<this.attributes.length; i++){
            GL.enableVertexAttribArray( this.attributes[i] );            
      }
      this.setMatrixUniforms();
      
      //unbind currentmesh. this updates the attributes passed to the shader
//      if(currentMesh){
//         currentMesh.boundBool = false;
//      }
   },
   
   end : function (){
      currentShader = null;
      GL.useProgram(null);
   },
   
   addAttriubte : function ( attrname ){
      var attrloc = GL.getAttribLocation(this.program, attrname); 
      if(attrloc !== -1){
         this.attributes.push( attrloc );

      }else{
         labLog( "no attribute named " + attrname +" in this shader" );
      }
      return attrloc;      
   },
   
   addAttribute : function ( attrname ){
      var attrloc = GL.getAttribLocation(this.program, attrname); 
      if(attrloc !== -1){
         this.attributes.push( attrloc );

      }else{
         labLog( "no attribute named " + attrname +" in this shader" );
      }
      return attrloc;      
   },
   
   addUniform : function ( uniformname ){
      var uniloc = GL.getUniformLocation( this.program, uniformname );
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
   //I know this is slowed by the GL.get calls but for convenience it's like this
   //should change in the the fututre
   setUniform1f : function ( uniformName, v1){
      GL.uniform1f(GL.getUniformLocation( this.program, uniformName), v1 );
   },
   setUniform2f : function ( uniformName, v1, v2){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform3f : function (  uniformName, v1, v2, v3){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform4f : function (  uniformName, v1, v2, v3, v4){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3, v4);
   },
   
   
   setUniform1fv : function (  uniformName, v ){
      GL.uniform1fv(GL.getUniformLocation( this.program, uniformName), v );
   },
   setUniform2fv : function (  uniformName, v ){
      GL.uniform2fv(GL.getUniformLocation( this.program, uniformName), v);
   },
   setUniform3fv : function (  uniformName, v ){
      GL.uniform3fv(GL.getUniformLocation( this.program, uniformName), v);
   },
   
   setUniform1i : function (  uniformName, v1){
      GL.uniform1f(GL.getUniformLocation( this.program, uniformName), v1 );
   },
   setUniform2i : function (  uniformName, v1, v2){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform3i : function (  uniformName, v1, v2, v3){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3 );
   },
   setUniform4i : function (  uniformName, v1, v2, v3, v4){
      GL.uniform3f(GL.getUniformLocation( this.program, uniformName), v1, v2, v3, v4);
   },
   
   setUniformTexture : function ( tex, uniformName, loc ){
      GL.uniform1i(GL.getUniformLocation(this.program, uniformName), loc);

      GL.activeTexture(GL.TEXTURE0 + loc);    
      GL.bindTexture(GL.TEXTURE_2D, tex.texture);
      GL.activeTexture(GL.TEXTURE0);
   },
   
   setMatrixUniforms : function () {
      GL.uniformMatrix4fv( this.mvMatrixUniform, false, modelviewMatrix );
      GL.uniformMatrix4fv( this.pMatrixUniform, false, projectionMatrix );
   },
   
};
