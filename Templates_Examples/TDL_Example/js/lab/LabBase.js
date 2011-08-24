// include required files
var LAB = LAB || {};

// reference to global context, in most cases 'window'.
LAB.global = this;

// require based on: http://closure-library.googlecode.com/svn/trunk/closure/goog/base.js

/*
 * helper (for javascript importing within javascript).
 */

var included = {}

LAB.writeScriptTag_ = function(src) {
	var doc = LAB.global.document;
	doc.write(
		'<script type="text/javascript" src="' + src + '"></' + 'script>');
	included[src] = true;
	return true;
}


LAB.require = function(src) {
	src in included ? console.log("already included") : LAB.writeScriptTag_(src);
}

LAB.requireBlocking = function(src)
{
	src in included ? console.log("already included") : $("head").append('<script type="text/javascript" src="' + src + '"></script>');
}


// start including stuff
LAB.require("js/lab/EventDispatcher.js");
LAB.require("js/lab/BaseApp.js");