// include required files
/** @namespace LAB*/
var LAB = LAB || {};

// reference to global context, in most cases 'window'.
LAB.global = this;

// require based on: http://closure-library.googlecode.com/svn/trunk/closure/goog/base.js

/*
 * helper (for javascript importing within javascript).
 */

var included = {}

/**
@function
@private
*/
LAB.writeScriptTag_ = function(src) {
	var doc = LAB.global.document;
	doc.write(
		'<script type="text/javascript" src="' + src + '"></' + 'script>');
	included[src] = true;
	return true;
}

/**
	Use this to load script files! (only script files right now)
	@function
	@public
*/
LAB.require = function(src) {
	src in included ? console.log("already included") : LAB.writeScriptTag_(src);
}

LAB.getScriptPath = function(filename)
{
	var scripts = document.getElementsByTagName('script');

    for (var i = scripts.length - 1; i >= 0; --i) {
		var src = scripts[i].src;
		var l = src.length;
		var length = filename.length;
		if (src.substr(l - length) == filename) {
        	// set a global propery here
        	return src.substr(0, l - length);
		}
    }
	return "";
}

LAB.toScriptPath	= function( className ){
	return LAB.src+className+".js";
}

LAB.src= LAB.getScriptPath("LabBase.js");

// start including stuff
LAB.require( LAB.src+"EventDispatcher.js" );
LAB.require( LAB.src+"app/BaseApp.js" );
LAB.require( LAB.src+"Utils.js" );