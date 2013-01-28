/** @namespace LAB*/
LAB = LAB || {};

/********************************************
	MATH
********************************************/

/**
 @function
 */
LAB.random 			= function( _min, _max){
   return Math.random() * ( _max - _min ) + _min;
}
/**
 @function
 */
LAB.randomInt  		= function( _min, _max) {
   return Math.floor( LAB.random( _min, _max ));
}
/**
 @function
 */
LAB.randomObject  	= function( _array ){
   return _array[ Math.min(LAB.randomInt(0, _array.length ), _array.length-1)];
}

/**
 @function
 */
LAB.map				= function(value, _oldMin, _oldMax, _min, _max){    
   return _min + ((value-_oldMin)/(_oldMax-_oldMin)) * (_max-_min);
}

/**
 * Lerp between two values
 * @param {Float} start 	Start value
 * @param {Float} stop 		End value
 * @param {Float} amount 	Where between values we're at (0-1.0)
 * @return {Float}      	Lerped value
 */
LAB.lerp			= function(start, stop, amt) {
	return start + (stop-start) * amt;
}

/**
 * Lerp values of two objects. Note: will return an object with same props as start; if stop 
 * Object does not have a value, it will return start value. 
 * e.g. LAB.lerpObject( {x:0,y:15}, {x:50}, .5 ) returns {x:25,y:15} 
 * @param {Float} start 	Start value
 * @param {Float} stop 		End value
 * @param {Float} amount 	Where between values we're at (0-1.0)
 * @return {Float}      	Lerped value
 */
LAB.lerpObjects		= function(start,stop,amt) {
	var returnObj = {};
	for ( var prop in start ){
		if ( stop.hasOwnProperty(prop) ){
			returnObj[prop] = LAB.lerp( start[prop], stop[prop], amt );
		} else {
			returnObj[prop] = start[prop];
		}
	}
	return returnObj;
}

/**
 @function
 */
LAB.clamp 			= function( value, _min, _max ){
   return Math.min( Math.max( value, _min), _max );
}

/**
 @function
 */
LAB.degToRad		= function( deg ){
   return deg * 0.0174532925;
}
/**
 @function
 */
LAB.radToDeg		= function( rad ){
   return rad * 57.2957795;
}

/**
 * @returns The sign of this number, 0 if the number is 0.
 * example: aNumber.x.sign();
 */
Number.prototype.sign = function() {
  if(this > 0) {
    return 1;
  } else if (this < 0) {
    return -1;
  } else {
    return 0;
  }
}

/********************************************
	LOGGING
********************************************/

/** @type {Number} */
LAB.DEBUG 		= 0;

/** @type {Number} */
LAB.WARNING		= 1;

/** @type {Number} */
LAB.ERROR 		= 2;

/** @type {Number} */
LAB.FATAL_ERROR	= 3;

/**
 * Global LAB log level 
 * @type {Number} 
*/
LAB.logLevel = LAB.WARNING;

/**
 * Set LAB.logLevel
 * @param {Integer} logLevel
 */
LAB.setLogLevel 	= function( logLevel ){
	if ( logLevel > LAB.FATAL_ERROR ) logLevel = LAB.FATAL_ERROR;
	if ( logLevel < LAB.DEBUG ) logLevel = LAB.DEBUG;
	LAB.logLevel = logLevel;
}

/**
 * Simple wrapper for console.log /  window.dump. Will only log if level is greater
 * than or equal to current level
 * @param  {String} 	text 
 * @param  {Integer} 	level (optional) LAB log level (defaults to LOG.DEBUG)
 */
LAB.log				= function( text, level ) {
	level = (level == null ? LAB.DEBUG : level);
	if ( LAB.logLevel > level ) return;

	if (window.console && window.console.log) {
	  window.console.log( text );
	} else if (window.dump) {
	  window.dump( text );
	}
}

/********************************************
	ANIMATION
********************************************/

	//http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	/** 
		@function 
		@public
	*/
	if ( !window.requestAnimationFrame ) {

		window.requestAnimationFrame = ( function() {

			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

				window.setTimeout( callback, 1000 / 60 );

			};

		} )();
	}
	
	// TO DO: window.cancelAnimationFrame

/********************************************
	BROWSER UTILS
********************************************/
	
	/**
	 * get string from url. e.g. www.lab.com/index.html?sandwich=turkey returns 'turkey'
	 * @param  {String} key      Query param (not including ? or &)
	 * @param  {String} default_ (Optional) what to return if param not found
	 * @return {String}          Returns value of key or default
	 */
	LAB.getQueryString = function(key, default_)
	{
		if (default_==null) default_=""; 
		key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
		var qs = regex.exec(window.location.href);
		if(qs == null)
			return default_;
		else
			return qs[1];
	}

/********************************************
	GENERIC UTILS
********************************************/

	LAB.alphabet = LAB.alphabet || ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];	

/********************************************
	COMPATIBILITY
********************************************/

	// add bind method for browsers that don't currently support it (such as Safari)
	if (!Function.prototype.bind) {  
	  Function.prototype.bind = function (oThis) {  
		if (typeof this !== "function") {  
		  // closest thing possible to the ECMAScript 5 internal IsCallable function  
		  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
		}  
	  
		var aArgs = Array.prototype.slice.call(arguments, 1),   
			fToBind = this,   
			fNOP = function () {},  
			fBound = function () {  
			  return fToBind.apply(this instanceof fNOP  
									 ? this  
									 : oThis || window,  
								   aArgs.concat(Array.prototype.slice.call(arguments)));  
			};  
	  
		fNOP.prototype = this.prototype;  
		fBound.prototype = new fNOP();  
	  
		return fBound;  
	  };  
	} 


/********************************************
	NAMESPACE
********************************************/
/**
 * Use this function to safely create a new namespace
 * if a namespace already exists, it won't be recreated.
 *
 * @function
 * @param {String} nsString The namespace as a string.
 * @return {Object} The namespace object.
 */
window.namespace = function (namespaceString) {
	var parts = namespaceString.split('.'),
		parent = window,
		i;

	for (i=0; i<parts.length; i +=1) {
		// create a property if it doesn't exist
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};	
