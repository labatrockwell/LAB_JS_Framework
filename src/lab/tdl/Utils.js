//shamelessly borrowed...

/** @namespace LAB.tdl */
LAB.tdl = LAB.tdl || {};

//includes
tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.fps');
tdl.require('tdl.framebuffers');
tdl.require('tdl.log');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.particles');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.textures');
tdl.require('tdl.webgl');

/********************
 ******glOBAL VARS******
 *********************/

	var gl = gl || null;
	var math;                 // the math lib.
	var fast;                 // the fast math lib.
	LAB.tdl.g_logglCals = true;  // whether or not to log webgl calls
	LAB.tdl.g_debug = false;      // whether or not to debug.
	LAB.tdl.g_drawOnce = false;   // draw just one frame.
	
	LAB.tdl.nearClip = 10;
	LAB.tdl.farClip = 10000;
	LAB.tdl.fov = 60
	LAB.tdl.aspect;
	
	LAB.tdl.currentShader = null;
	LAB.tdl.currentMesh = null;

/********************
 ******MATRICES******
 *********************/

// pre-allocate a bunch of arrays
LAB.tdl.projection       = new Float32Array(16);
LAB.tdl.view             = new Float32Array(16);
LAB.tdl.projectionMatrix = new Float32Array(16);
LAB.tdl.modelviewMatrix  = new Float32Array(16);
LAB.tdl.mvMatrixStack    = [];
LAB.tdl.projectionStack  = [];

LAB.tdl.eyePosition 	= new Float32Array(3);
LAB.tdl.target 			= new Float32Array(3);
LAB.tdl.up 				= new Float32Array([0,-1,0]);


LAB.tdl.pushMatrix = function() {
   
   var copy = new Float32Array(16);
   tdl.fast.matrix4.copy(copy, LAB.tdl.modelviewMatrix);
   LAB.tdl.mvMatrixStack.push(copy);
}

LAB.tdl.popMatrix	= function() {
   if (LAB.tdl.mvMatrixStack.length == 0) {
      throw "Invalid labPopMatrix!";
   }
   LAB.tdl.modelviewMatrix = LAB.tdl.mvMatrixStack.pop();
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();//<-- so we can make transforms after shader.begin()
   }
}

//function labSetCameraPos( x, y, z){
//   eyePosition[0] = x;
//   eyePosition[1] = y;
//   eyePosition[2] = z;
//}
//
//function labSetCameraTarget( x, y, z){
//   target[0] = x;
//   target[1] = y;
//   target[2] = z;
//}


LAB.tdl.setPerspective	= function( _fov, _aspect, _near, _far ){
   LAB.tdl.fov = _fov;
   LAB.tdl.aspect = _aspect;
   LAB.tdl.nearClip = _near;
   LAB.tdl.farClip = _far;
   
   fast.matrix4.perspective(LAB.tdl.projection, math.degToRad(LAB.tdl.fov), LAB.tdl.aspect, LAB.tdl.nearClip, LAB.tdl.farClip);
}

LAB.tdl.translate	= function(  x,  y, z ){
   fast.matrix4.translate(LAB.tdl.modelviewMatrix, [x, y, z]);
   
   if(LAB.tdl.currentShader){//<-- so we can make transforms after shader.begin()
      LAB.tdl.currentShader.setMatrixUniforms();
   }
}
LAB.tdl.scale	= function( x, y, z ){
   fast.matrix4.scale(LAB.tdl.modelviewMatrix, [x, y, z]);
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();
   }
}
LAB.tdl.rotate	= function( angle, x, y, z){
   
   fast.matrix4.axisRotate(LAB.tdl.modelviewMatrix, [x, y, z], angle); 
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();
   }
}

//LAB.tdl.lookAt( _eyepos, _target, _up ){
//   //fast.matrix4.lookAt(modelviewMatrix, _eyepos, _target, _up);
//   
//   
//   //tdl.math.matrix4.cameraLookAteye, target, up);
//   
//   //tdl.math.matrix4.lookAt(eye, target, up);
//   
//   //fast.rowMajor.mulMatrixMatrix4(modelviewMatrix, m, modelviewMatrix);
//   
//   
//   if(LAB.tdl.currentShader){
//      LAB.tdl.currentShader.setMatrixUniforms();
//   }
//}

LAB.tdl.matrixMult	= function( m ){
   fast.rowMajor.mulMatrixMatrix4(LAB.tdl.modelviewMatrix, m, LAB.tdl.modelviewMatrix);
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();
   }
}
//function labRotate( q ){
//   modelviewMatrix.setRotationFromQuaternion( q );
//}

LAB.tdl.setSceneTile	= function( scenePos, sceneScl, canvasPos, canvasDim ){
	gl.enable(gl.SCISSOR_TEST);
	gl.viewport(-scenePos[0]*sceneScl + canvasPos[0],// -position + screenposition(centers the view)
              -scenePos[1]*sceneScl + canvasPos[1],
              total_width*sceneScl,
              total_height*sceneScl);
	gl.scissor(canvasPos[0], canvasPos[1], canvasDim[0], canvasDim[1]);
	gl.disable(gl.SCISSOR_TEST);
}

/***********************
 ******MISC UTILS*******
 ************************/
LAB.tdl.getWidth	= function(){
   return window.innerWidth;
}
LAB.tdl.getHeight	= function(){
   return window.innerHeight;
}
LAB.tdl.getElapsedTime	= function(){
   return elapsedTime;
}
LAB.tdl.getCanvasWidth	= function(){
   return LAB.tdl.canvas.width;
}
LAB.tdl.getCanvasHeight	= function(){
   return LAB.tdl.canvas.height ;
}

/********************
 ****SETUP&UPDATE****
 ********************/
LAB.tdl.setup	= function(){
   //math and matrix
   math = tdl.math;
   fast = tdl.fast;
   
   //setup canvas and context
   LAB.tdl.canvas = document.getElementById("canvas");
   LAB.tdl.g_fpsTimer = new tdl.fps.FPSTimer();
   
   gl = tdl.webgl.setupWebGL(LAB.tdl.canvas);
   if (!gl) {
      return false;
   }
   if (LAB.tdl.g_debug) {
      gl = tdl.webgl.makeDebugContext(gl, undefined, LogglCall);
   }
   
   LAB.tdl.setMatrices();
}

LAB.tdl.update	= function(){
   
   var now = (new Date()).getTime();
   if(LAB.tdl.lastTime == 0.0) {
      LAB.tdl.deltaTime = 0.0;
   } else {
      LAB.tdl.deltaTime = now - LAB.tdl.lastTime;
   }
   LAB.tdl.lastTime = now;
   LAB.tdl.labTimeDelta = deltaTime;
   
   LAB.tdl.g_fpsTimer.update(deltaTime * .001);//<--- to milliseconds?
   if (fpsElem != null){
		fpsElem.innerHTML = LAB.tdl.g_fpsTimer.averageFPS;		
	} 
   
   LAB.tdl.labFPS = LAB.tdl.g_fpsTimer.instantaneousFPS;
   LAB.tdl.elapsedTime += LAB.tdl.deltaTime;
}

LAB.tdl.setMatrices	= function(){
   //taken from openframeworks
   LAB.tdl.eyePosition[0] = LAB.tdl.getCanvasWidth()/2;
   LAB.tdl.eyePosition[1] = LAB.tdl.getCanvasHeight()/2;
   LAB.tdl.eyePosition[2] = LAB.tdl.eyePosition[1] / Math.tan( Math.PI * LAB.tdl.fov / 360 );
   LAB.tdl.aspect = LAB.tdl.getCanvasWidth() / LAB.tdl.getCanvasHeight();
   LAB.tdl.target[0] = LAB.tdl.eyePosition[0];
   LAB.tdl.target[1] = LAB.tdl.eyePosition[1];
   LAB.tdl.target[2] = 0;
   
   LAB.tdl.nearClip = LAB.tdl.eyePosition[2] / 10;
   LAB.tdl.farClip = LAB.tdl.eyePosition[2] * 10;
   
   fast.identity4( LAB.tdl.projectionMatrix );
   fast.matrix4.perspective( LAB.tdl.projectionMatrix, math.degToRad(LAB.tdl.fov), LAB.tdl.aspect, LAB.tdl.nearClip, LAB.tdl.farClip);
   
   fast.identity4(LAB.tdl.modelviewMatrix);
   fast.matrix4.lookAt(LAB.tdl.modelviewMatrix, LAB.tdl.eyePosition, LAB.tdl.target, LAB.tdl.up);
   
   
   //move to upper left corner and scale. mimics openframeworks setup
   LAB.tdl.scale(-1,1,1);
   LAB.tdl.translate(-LAB.tdl.getCanvasWidth(), 0, 0);
}

LAB.tdl.lookAt	= function(eyePos, targetPos, up){
   fast.identity4(modelviewMatrix);
   fast.matrix4.lookAt(modelviewMatrix, eyePosition, target, up);
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();
   }
}

LAB.tdl.setPerspectiveToCanvas	= function(){
   aspect = LAB.tdl.getCanvasWidth() / LAB.tdl.getCanvasHeight();
   fast.matrix4.perspective( LAB.tdl.projectionMatrix, math.degToRad(LAB.tdl.fov), LAB.tdl.aspect, LAB.tdl.nearClip, LAB.tdl.farClip);
}
LAB.tdl.setPerspectiveToWindow	= function(){
   aspect = labGetWidth() / labGetHeight();
   fast.matrix4.perspective( LAB.tdl.projectionMatrix, math.degToRad(LAB.tdl.fov), LAB.tdl.aspect, LAB.tdl.nearClip, LAB.tdl.farClip);
}
LAB.tdl.labSetAspect	= function(w, h){
   fast.matrix4.perspective( LAB.tdl.projectionMatrix, math.degToRad(LAB.tdl.fov), w/h, LAB.tdl.nearClip, LAB.tdl.farClip);
}
LAB.tdl.labPushProjection	= function(){
   var copy = new Float32Array(16);
   tdl.fast.matrix4.copy(copy, LAB.tdl.projectionMatrix);
   LAB.tdl.projectionStack.push(copy);
}
LAB.tdl.labPopProjection	= function(){
   if (LAB.tdl.projectionStack.length == 0) {
      throw "no more porjections to pop!";
   }
   LAB.tdl.projectionMatrix = LAB.tdl.projectionStack.pop();
   
   if(LAB.tdl.currentShader){
      LAB.tdl.currentShader.setMatrixUniforms();//<-- so we can make transforms after shader.begin()
   }
}

/*******************
 ********LOG********
 *******************/
LAB.tdl.ValidateNoneOfTheArgsAreUndefined	= function(functionName, args) {
   for (var ii = 0; ii < args.length; ++ii) {
      if (args[ii] === undefined) {
         tdl.error("undefined passed to gl." + functionName + "(" +
         tdl.webgl.glFunctionArgsToString(functionName, args) + ")");
      }
   }
}

LAB.tdl.Log	= function(msg) {
   if (LAB.tdl.g_logglCalls) {
      tdl.log(msg);
   }
}

LAB.tdl.LogglCall	= function(functionName, args) {
   if (LAB.tdl.g_logglCalls) {
      ValidateNoneOfTheArgsAreUndefined(functionName, args)
      tdl.log("gl." + functionName + "(" +
      tdl.webgl.glFunctionArgsToString(functionName, args) + ")");
   }
}

LAB.tdl.labLog	= function( labOut ){
   var currentLog = LAB.tdl.g_logglCalls;
   LAB.tdl.g_logglCalls = true;
   Log( labOut );
   LAB.tdl.g_logglCalls = currentLog;
}

/*******************
 ******utils*******
 *******************/


LAB.tdl.labRandom	= function( min, max ){
   return tdl.math.pseudoRandom()*(max-min) + min;
}

LAB.tdl.labMap	= function(value, oldMin, oldMax, min, max){    
   return min + ((value-oldMin)/(oldMax-oldMin)) * (max-min);
}

//function labSmootherStep(e0, e1, _b)
//{
//   if((e1 - e0) == 0){
//      return 0;//??
//   }
//   var x = Math.max(Math.min((_b - e0)/(e1 - e0), 1), 0);
//   return x*x*x*(x*(x*6 - 15) + 10);// Evaluate polynomial
//}
LAB.tdl.labSmootherStep	= function( edge0,  edge1, x)
{
   x = Math.min(Math.max(x, 0), 1);
// Evaluate polynomial
return LAB.tdl.labMap(x*x*x*(x*(x*6 - 15) + 10), 0,1,edge0, edge1);
}
