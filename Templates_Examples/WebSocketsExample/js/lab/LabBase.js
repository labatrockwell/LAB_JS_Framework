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

// start including stuff
LAB.require("js/lab/EventDispatcher.js");
LAB.require("js/lab/app/BaseApp.js");