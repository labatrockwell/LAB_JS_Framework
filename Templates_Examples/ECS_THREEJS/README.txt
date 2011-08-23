/************************************************
	LAB JS BASE APP
************************************************/

INCLUDED LIBRARIES
- jquery
- three.js
	- 2D + 3D rendering through canvas + WebGL, respectively
	- https://github.com/mrdoob/three.js/
- tween.js
	- js tweening engine
	- https://github.com/sole/tween.js
	
// KNOWN ISSUES

LAB.require is blocking, which is nice... HOWEVER: errors in 
your included .js files WILL NOT show up at the correct line
number in the chrome debugger. If you are getting errors and
can't figure them out, include the offending JS file in your 
HTML.