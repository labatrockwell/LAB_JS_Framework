/** @namespace LAB.sound*/
LAB.sound = LAB.sound || {};

if (typeof webkitAudioContext == "function") {
    LAB.sound.Context 	= LAB.sound.Context || new webkitAudioContext();
};