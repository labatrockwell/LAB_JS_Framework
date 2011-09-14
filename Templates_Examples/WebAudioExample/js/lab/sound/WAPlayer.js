/** @namespace LAB.sound*/
LAB.sound = LAB.sound || {};

LAB.require("js/lab/EventDispatcher.js");

// creates global audio context if there isn't one yet
LAB.require("js/lab/sound/AudioContext.js");

/** 
 Web Audio Player
 Web Audio must be enabled in Chrome via about:flags
 @constructor 
 */
LAB.sound.WAPlayer = function( ){//loop, autoplay, controls ){		
	LAB.EventDispatcher.call( this );
	
	//this.loop 		= loop || false;
	//this.autoplay 	= autoplay || false;
	//this.controls	= controls || false;
	
	this.eventsRegistered = false;
	this.source = LAB.sound.Context.createBufferSource();
	this.source.playbackRate.value = 1.0;
    //this.source.looping = true;
    //this.source.noteOn(0.020);
	this.source.connect(LAB.sound.Context.destination);
	
	if (!parent){
		console.log ("ERROR! please pass in an HTML element to attach the WAPlayer to");
	} else {

	}	
}

// METHODS

LAB.sound.WAPlayer.prototype.loadFile 		= function( url )
{	
	//this.registerEvents();
	var request = new XMLHttpRequest();
	request.parent = this;
    request.open("GET", url, false);
    request.responseType = "arraybuffer";
	request.parent = this;
	
    request.onload = function() { 
        request.parent.buffer = LAB.sound.Context.createBuffer(request.response, true);
        request.parent.source.buffer = request.parent.buffer;
		console.log("yes");
    }

    request.send();	
}

// PLAYBACK METHODS

LAB.sound.WAPlayer.prototype.play	= function(){
	//this.source.noteOff(0);
	var buffer = this.source.buffer;
	var source = LAB.sound.Context.createBufferSource();	
	source.playbackRate.value = this.source.playbackRate.value;
	source.buffer = this.source.buffer;
	source.connect(LAB.sound.Panner);
	LAB.sound.Panner.connect(LAB.sound.Context.destination);
	source.noteOn(0);
	//this.WAPlayerElement.play();
}

LAB.sound.WAPlayer.prototype.pause	= function(){
	//this.WAPlayerElement.pause();
}

LAB.sound.WAPlayer.prototype.setVolume	= function(volume){
	//this.WAPlayerElement.volume = volume;
}

LAB.sound.WAPlayer.prototype.setPan	= function(x){
	LAB.sound.Panner.setPosition(x,0,0);
	//this.WAPlayerElement.volume = volume;
}

LAB.sound.WAPlayer.prototype.setPitch	= function(pitch){
	//this.WAPlayerElement.volume = volume;
	
    var rate = Math.pow(2.0, pitch / 1200.0);
    this.source.playbackRate.value = rate;
}

LAB.sound.WAPlayer.prototype.seekTo	= function(time){
	//this.WAPlayerElement.currentTime = time;
}

// EVENTS

/**
@function
@private
*/
LAB.sound.WAPlayer.prototype.registerEvents = function(){
	if (this.eventsRegistered) return;
	
	// register events
	this.WAPlayerElement.addEventListener("load", this.onLoad);
	this.WAPlayerElement.addEventListener("ended", this.onEnded);
	this.WAPlayerElement.addEventListener("error", this.onError);
	this.eventsRegistered = true;
}

/**
@function
@private
*/
LAB.sound.WAPlayer.prototype.onLoad	= function(event){
	this.dispatchEvent("onLoad", event);
}

/**
@function
@private
*/
LAB.sound.WAPlayer.prototype.onEnded	= function(event){
	this.dispatchEvent("onEnded", event);	
}

/**
@function
@private
*/
LAB.sound.WAPlayer.prototype.onError	= function(event){
	console.log(event);
	this.dispatchEvent("onError", event);	
}

// Getters
/**
@function
*/
LAB.sound.WAPlayer.prototype.getElement = function()
{
	return this.WAPlayerElement;
}
/**
@function
@param {boolean} bLoop
*/
LAB.sound.WAPlayer.prototype.isLooping = function( bLoop )
{
	return this.loop;
}
/**
@function
@param {boolean} bAutoplay
*/
LAB.sound.WAPlayer.prototype.isAutoplay = function( bAutoplay )
{
	return this.autoplay;
}

/**
@function
@param {boolean} bControls
*/
LAB.sound.WAPlayer.prototype.hasControls = function( bControls )
{
	return this.controls;
}

// Setters
/**
@function
*/

LAB.sound.WAPlayer.prototype.setLooping = function( bLoop )
{
	this.loop = bLoop;
	if (this.loop){
		this.WAPlayerElement.setAttribute('loop', 'loop');			
	} else {
		this.WAPlayerElement.removeAttribute('loop');
	}
}
/**
@function
*/
LAB.sound.WAPlayer.prototype.setAutoplay = function( bAutoplay )
{
	this.autoplay = bAutoplay;
	if (this.autoplay){
		this.WAPlayerElement.setAttribute('autoplay', 'autoplay');			
	} else {
		this.WAPlayerElement.removeAttribute('autoplay');
	}
}
/**
@function
*/
LAB.sound.WAPlayer.prototype.setControls = function( bControls )
{
	this.controls = bControls;
	if (this.controls){
		this.WAPlayerElement.setAttribute('controls', 'controls');			
	} else {
		this.WAPlayerElement.removeAttribute('controls');
	}
}