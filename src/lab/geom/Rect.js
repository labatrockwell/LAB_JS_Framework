/** @namespace LAB.geom*/
LAB.geom = LAB.geom || {};

/** 
 @constructor 
**/
LAB.geom.Rect = function( x, y, z, w, h){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.width 	= w || 0;
	this.height = h || 0;
};