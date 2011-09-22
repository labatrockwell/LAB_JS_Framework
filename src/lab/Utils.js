/** @namespace LAB*/
LAB = LAB || {};

/********************************************
	MATH
********************************************/

LAB.random 			= function( _min, _max){
   return Math.random() * ( _max - _min ) + _min;
}

LAB.randomInt  		= function( _min, _max) {
   return Math.floor( labRandom( _min, _max ));
}

LAB.randomObject  	= function( _array ){
   return _array[ Math.min(labRandomInt(0, _array.length ), _array.length-1)];
}

LAB.map				= function(value, _oldMin, _oldMax, _min, _max){    
   return _min + ((value-_oldMin)/(_oldMax-_oldMin)) * (_max-_min);
}

LAB.degToRad		= function( deg ){
   return deg * 0.0174532925;
}

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

LAB.log				= function( text ) {
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
	
	// get string from url. e.g. www.lab.com/index.html?sandwich=turkey returns 'turkey'

	LAB.getQueryString = function (key)
	{
		key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
		var qs = regex.exec(window.location.href);
		if(qs == null)
			return '';
		else
			return qs[1];
	}