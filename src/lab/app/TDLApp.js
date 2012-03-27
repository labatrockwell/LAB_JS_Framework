// include LabBase files
/** @namespace LAB.app */
//LAB.require(LAB.src+"app/BaseApp.js");

// include TDL utils from Lars
//LAB.require(LAB.src+'tdl/Utils.js');
//LAB.require(LAB.src+'tdl/Mesh.js');
//LAB.require(LAB.src+'tdl/Object.js');
//LAB.require(LAB.src+'tdl/Shader.js');

/** 
	@constructor 
	@extends LAB.app.BaseApp
*/
LAB.app.TDLApp = function()
{
	LAB.app.BaseApp.call( this );
	
	// declare all the base vars

	LAB.tdl.canvas;               // the canvas
	
	this.lastTime = 0;
	this.elapsedTime = 0;
	this.labTimeDelta=0;
	this.fpsElem = null;
	this.labFPS;
	this.deltaTime;
	
	this.labEyePos = [0, 0, 0];
	
	/**
	* Is screen orthographic or not? (can change from frame to frame)
	* @type boolean
	*/

	this.bOrthographic = false;
}	
	
/************************************************************
	EXTEND
************************************************************/
	
	LAB.app.TDLApp.prototype = new LAB.app.BaseApp();
	LAB.app.TDLApp.prototype.constructor = LAB.app.TDLApp;
	LAB.app.TDLApp.prototype.supr = LAB.app.BaseApp.prototype;

/************************************************************
	SETUP
************************************************************/
	
	/** 
		Call to set up Webgl, initialize the canvas, build matrices,
		and start animate() loop
		@function 
		@public
	*/
	
	LAB.app.TDLApp.prototype.begin = function()
	{
		console.log('begin');
		//math and matrix
		math = tdl.math;
		fast = tdl.fast;

		this.registerKeyEvents();
		this.registerMouseEvents();
		//setup canvas and context
				
		if (document.getElementById("canvas") != null){
			LAB.tdl.canvas = document.getElementById("canvas");
		} else {
			console.log("no canvas in document, generating")
			LAB.tdl.canvas = document.createElement( 'canvas' );
			LAB.tdl.canvas.width 	= window.innerWidth;
			LAB.tdl.canvas.height	= window.innerHeight;
			
			if (document.body)
				document.body.appendChild( LAB.tdl.canvas );
			else
				return;
		}
		
		g_fpsTimer = new tdl.fps.FPSTimer();

		gl = tdl.webgl.setupWebGL(LAB.tdl.canvas);
		if (!gl) {
			console.log("ERROR SETTING UP gl");
			return false;
		}
		if (LAB.g_debug) {
			gl = tdl.webgl.makeDebugContext(gl, undefined, LogglCall);
		}
		
		// util function stored in LabUtils
		// !!!! needs to be refactored
		LAB.tdl.setMatrices();
		this.setup();
		this.animate();
	}

/************************************************************
	UPDATING: OVERRIDE PREUPDATE TO PREP MATRICES
************************************************************/

	/** 
		Calculates elapsed + delta time
		@function 
		@private
	*/

	LAB.app.TDLApp.prototype.preupdate = function(){
		var now = (new Date()).getTime();
		if(this.lastTime == 0.0) {
 			this.deltaTime = 0.0;
	   	} else {
	      this.deltaTime = this.now - this.lastTime;
	   	}
		this.lastTime 		= this.now;
		this.labTimeDelta 	= this.deltaTime;

		g_fpsTimer.update(this.deltaTime * .001);//<--- to milliseconds?
		if (this.fpsElem != null){
			this.fpsElem.innerHTML = g_fpsTimer.averageFPS;		
		} 

		this.labFPS = g_fpsTimer.instantaneousFPS;
		this.elapsedTime += this.deltaTime;
	}

/************************************************************
	DRAWING: OVERRIDE PREDRAW AND POSTDRAW TO SET UP gl CTX
************************************************************/
	
	/** 
		Sets up Webgl drawing context, blending, projection/modelview matrices
		@function 
		@private
	*/

	LAB.app.TDLApp.prototype.predraw = function(){
	   	// turn off logging after 1 frame.
	   	g_logglCalls = false;
	
		gl.clearColor( 1,1,1,1 );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		gl.disable( gl.DEPTH_TEST );
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA , gl.ONE_MINUS_SRC_ALPHA);
	
		gl.viewport(0, 0, LAB.tdl.canvas.width, LAB.tdl.canvas.height);//fit viewport to screen
		
		LAB.tdl.pushMatrix();
		
		// give you an option to push to orthographic (flat) projection
		if (this.bOrthographic){			
			LAB.tdl.pushProjection();
			//remake perspective     
			fast.identity4( projectionMatrix );                          
			projectionMatrix = tdl.math.matrix4.orthographic(0, LAB.tdl.canvas.width, 0, LAB.tdl.canvas.height, LAB.tdl.nearClip, LAB.tdl.farClip);
			//remake modelview matrix
			fast.identity4(modelviewMatrix);

			//move to upper left corner and scale. mimics openframeworks setup
			LAB.tdl.scale(1,-1,1);
			LAB.tdl.translate(0, -LAB.tdl.canvas.height, 0);
		}
	};
	
	/** 
		Pops matrices
		@function 
		@private
	*/
	
	LAB.app.TDLApp.prototype.postdraw = function(){
		if (this.bOrthographic) labPopProjection();
		LAB.tdl.popMatrix();
	}
