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
	var g_fpsTimer;           // object to measure frames per second;
	var g_logglCalls = true;  // whether or not to log webgl calls
	var g_debug = false;      // whether or not to debug.
	var g_drawOnce = false;   // draw just one frame.
	
	var nearClip = 10, farClip = 10000, fov = 60, aspect;
	
	var currentShader = null, currentMesh = null;

/********************
 ******MATRICES******
 *********************/

// pre-allocate a bunch of arrays
var projection       = new Float32Array(16);
var view             = new Float32Array(16);
var projectionMatrix = new Float32Array(16);
var modelviewMatrix  = new Float32Array(16);
var mvMatrixStack    = [];
var projectionStack = [];

var eyePosition = new Float32Array(3);
var target = new Float32Array(3);
var up = new Float32Array([0,-1,0]);


function labPushMatrix() {
   
   var copy = new Float32Array(16);
   tdl.fast.matrix4.copy(copy, modelviewMatrix);
   mvMatrixStack.push(copy);
}

function labPopMatrix() {
   if (mvMatrixStack.length == 0) {
      throw "Invalid labPopMatrix!";
   }
   modelviewMatrix = mvMatrixStack.pop();
   
   if(currentShader){
      currentShader.setMatrixUniforms();//<-- so we can make transforms after shader.begin()
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


function labSetPerspective( _fov, _aspect, _near, _far ){
   fov = _fov;
   aspect = _aspect;
   nearClip = _near;
   farClip = _far;
   
   fast.matrix4.perspective(projection, math.degToRad(fov), aspect, nearClip, farClip);
}

function labTranslate(  x,  y, z ){
   fast.matrix4.translate(modelviewMatrix, [x, y, z]);
   
   if(currentShader){//<-- so we can make transforms after shader.begin()
      currentShader.setMatrixUniforms();
   }
}
function labScale( x, y, z ){
   fast.matrix4.scale(modelviewMatrix, [x, y, z]);
   
   if(currentShader){
      currentShader.setMatrixUniforms();
   }
}
function labRotate( angle, x, y, z){
   
   fast.matrix4.axisRotate(modelviewMatrix, [x, y, z], angle); 
   
   if(currentShader){
      currentShader.setMatrixUniforms();
   }
}

//function labLookAt( _eyepos, _target, _up ){
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
//   if(currentShader){
//      currentShader.setMatrixUniforms();
//   }
//}

function labMatrixMult( m ){
   fast.rowMajor.mulMatrixMatrix4(modelviewMatrix, m, modelviewMatrix);
   
   if(currentShader){
      currentShader.setMatrixUniforms();
   }
}
//function labRotate( q ){
//   modelviewMatrix.setRotationFromQuaternion( q );
//}

function setSceneTile( scenePos, sceneScl, canvasPos, canvasDim ){
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
function labGetWidth(){
   return window.innerWidth;
}
function labGetHeight(){
   return window.innerHeight;
}
function labGetElapsedTime(){
   return elapsedTime;
}
function labGetCanvasWidth(){
   return canvas.width;
}
function labGetCanvasHeight(){
   return canvas.height ;
}

/********************
 ****SETUP&UPDATE****
 ********************/
function labSetup(){
   //math and matrix
   math = tdl.math;
   fast = tdl.fast;
   
   //setup canvas and context
   canvas = document.getElementById("canvas");
   g_fpsTimer = new tdl.fps.FPSTimer();
   
   gl = tdl.webgl.setupWebGL(canvas);
   if (!gl) {
      return false;
   }
   if (g_debug) {
      gl = tdl.webgl.makeDebugContext(gl, undefined, LogglCall);
   }
   
   labSetMatrices();
}

function labUpdate(){
   
   var now = (new Date()).getTime();
   if(lastTime == 0.0) {
      deltaTime = 0.0;
   } else {
      deltaTime = now - lastTime;
   }
   lastTime = now;
   labTimeDelta = deltaTime;
   
   g_fpsTimer.update(deltaTime * .001);//<--- to milliseconds?
   if (fpsElem != null){
		fpsElem.innerHTML = g_fpsTimer.averageFPS;		
	} 
   
   labFPS = g_fpsTimer.instantaneousFPS;
   elapsedTime += deltaTime;
}

function labSetMatrices(){
   //taken from openframeworks
   eyePosition[0] = labGetCanvasWidth()/2;
   eyePosition[1] = labGetCanvasHeight()/2;
   eyePosition[2] = eyePosition[1] / Math.tan( Math.PI * fov / 360 );
   aspect = labGetCanvasWidth() / labGetCanvasHeight();
   target[0] = eyePosition[0];
   target[1] = eyePosition[1];
   target[2] = 0;
   
   nearClip = eyePosition[2] / 10;
   farClip = eyePosition[2] * 10;
   
   fast.identity4( projectionMatrix );
   fast.matrix4.perspective( projectionMatrix, math.degToRad(fov), aspect, nearClip, farClip);
   
   fast.identity4(modelviewMatrix);
   fast.matrix4.lookAt(modelviewMatrix, eyePosition, target, up);
   
   
   //move to upper left corner and scale. mimics openframeworks setup
   labScale(-1,1,1);
   labTranslate(-labGetCanvasWidth(), 0, 0);
}

function labLookAt(eyePos, targetPos, up){
   fast.identity4(modelviewMatrix);
   fast.matrix4.lookAt(modelviewMatrix, eyePosition, target, up);
   
   if(currentShader){
      currentShader.setMatrixUniforms();
   }
}

function labSetPerspectiveToCanvas(){
   aspect = labGetCanvasWidth() / labGetCanvasHeight();
   fast.matrix4.perspective( projectionMatrix, math.degToRad(fov), aspect, nearClip, farClip);
}
function labSetPerspectiveToWindow(){
   aspect = labGetWidth() / labGetHeight();
   fast.matrix4.perspective( projectionMatrix, math.degToRad(fov), aspect, nearClip, farClip);
}
function labSetAspect(w, h){
   fast.matrix4.perspective( projectionMatrix, math.degToRad(fov), w/h, nearClip, farClip);
}
function labPushProjection(){
   var copy = new Float32Array(16);
   tdl.fast.matrix4.copy(copy, projectionMatrix);
   projectionStack.push(copy);
}
function labPopProjection(){
   if (projectionStack.length == 0) {
      throw "no more porjections to pop!";
   }
   projectionMatrix = projectionStack.pop();
   
   if(currentShader){
      currentShader.setMatrixUniforms();//<-- so we can make transforms after shader.begin()
   }
}

/*******************
 ********LOG********
 *******************/
function ValidateNoneOfTheArgsAreUndefined(functionName, args) {
   for (var ii = 0; ii < args.length; ++ii) {
      if (args[ii] === undefined) {
         tdl.error("undefined passed to gl." + functionName + "(" +
         tdl.webgl.glFunctionArgsToString(functionName, args) + ")");
      }
   }
}

function Log(msg) {
   if (g_logglCalls) {
      tdl.log(msg);
   }
}

function LogglCall(functionName, args) {
   if (g_logglCalls) {
      ValidateNoneOfTheArgsAreUndefined(functionName, args)
      tdl.log("gl." + functionName + "(" +
      tdl.webgl.glFunctionArgsToString(functionName, args) + ")");
   }
}

function labLog( labOut ){
   var currentLog = g_logglCalls;
   g_logglCalls = true;
   Log( labOut );
   g_logglCalls = currentLog;
}

/*******************
 ******utils*******
 *******************/


function labRandom( min, max ){
   return tdl.math.pseudoRandom()*(max-min) + min;
}

function labMap(value, oldMin, oldMax, min, max){    
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
function labSmootherStep( edge0,  edge1, x)
{
   x = Math.min(Math.max(x, 0), 1);
// Evaluate polynomial
return labMap(x*x*x*(x*(x*6 - 15) + 10), 0,1,edge0, edge1);
}
